# WHO Growth Evaluation - Frontend Integration Guide

## 🎯 Purpose

This guide shows how the Frontend (Next.js PWA) should consume the WHO Growth Evaluation endpoint to display child growth assessment results to parents and Posyandu staff.

---

## 📦 Frontend Setup

### 1. Type Imports

```typescript
// In fe/src/types/who.types.ts (copy from backend or import)
export interface WhoGrowthEvaluationResponse {
  success: boolean;
  childId: string;
  input: {
    gender: string;
    ageMonths: number;
    heightCm: number;
    weightKg: number;
  };
  calculation: {
    rawValue: number;
    median: number;
    zScore: number;
    method: string;
    closestSD: string;
  };
  classification: {
    stuntingStatus: "SEVERELY_STUNTED" | "STUNTED" | "NORMAL" | "TALL";
    severity: "SEVERE" | "MODERATE" | "MILD" | "NORMAL";
    threshold: string;
    sdRange: string;
    percentageOfMedian: number;
  };
  recommendation: {
    riskLevel: "CRITICAL" | "HIGH" | "MODERATE" | "LOW" | "NORMAL";
    actions: string[];
    referralNeeded: boolean;
    nutritionIntervention: boolean;
    followUpInDays?: number;
  };
  traceability: {
    rule: string;
    genderUsed: string;
    ageUsedMonths: number;
    source: string;
    dataset: string;
    decisionLogic: string[];
    calculatedAt: string;
  };
  metadata: {
    evaluatedAt: string;
    expiresAt?: string;
  };
}

export interface WhoGrowthErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  metadata: {
    evaluatedAt: string;
  };
}
```

### 2. Custom Hook for WHO Evaluation

```typescript
// fe/src/hooks/mutation/who/useWhoGrowthEvaluation.ts

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  WhoGrowthInput,
  WhoGrowthEvaluationResponse,
  WhoGrowthErrorResponse,
} from "@/types/who.types";

export function useWhoGrowthEvaluation() {
  return useMutation({
    mutationFn: async (
      input: WhoGrowthInput
    ): Promise<WhoGrowthEvaluationResponse | WhoGrowthErrorResponse> => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/measurement/who-evaluation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(input),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        // Handle success
        console.log("Evaluation complete:", data.classification);
      } else {
        // Handle error response
        console.error("Evaluation error:", data.error);
      }
    },
    onError: (error) => {
      console.error("Request failed:", error);
    },
  });
}

/**
 * Hook to get child's measurement history
 */
export function useMeasurementHistory(childId: string) {
  return useQuery({
    queryKey: ["measurements", childId],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/measurement/${childId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch measurements");
      return response.json();
    },
  });
}
```

---

## 🎨 Component Examples

### 1. WHO Growth Evaluation Form Component

```typescript
// fe/src/components/section/private/parent/who-growth-form.tsx

'use client';

import { useState } from 'react';
import { useWhoGrowthEvaluation } from '@/hooks/mutation/who/useWhoGrowthEvaluation';
import { WhoGrowthInput } from '@/types/who.types';

interface WhoGrowthFormProps {
  childId: string;
  childName: string;
  onSuccess?: (evaluation: any) => void;
}

export default function WhoGrowthForm({
  childId,
  childName,
  onSuccess,
}: WhoGrowthFormProps) {
  const [formData, setFormData] = useState({
    gender: 'MALE',
    ageMonths: 24,
    heightCm: 87.0,
    weightKg: 12.5,
  });

  const mutation = useWhoGrowthEvaluation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const input: WhoGrowthInput = {
      childId,
      ...formData,
    };

    const result = await mutation.mutateAsync(input);

    if (result.success) {
      onSuccess?.(result);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Gender</label>
        <select
          value={formData.gender}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, gender: e.target.value as 'MALE' | 'FEMALE' }))
          }
          className="mt-1 w-full rounded border p-2"
        >
          <option value="MALE">Laki-laki</option>
          <option value="FEMALE">Perempuan</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Usia (bulan)</label>
        <input
          type="number"
          min="0"
          max="120"
          value={formData.ageMonths}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, ageMonths: parseInt(e.target.value) }))
          }
          className="mt-1 w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Tinggi (cm)</label>
        <input
          type="number"
          step="0.1"
          value={formData.heightCm}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, heightCm: parseFloat(e.target.value) }))
          }
          className="mt-1 w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Berat (kg)</label>
        <input
          type="number"
          step="0.1"
          value={formData.weightKg}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, weightKg: parseFloat(e.target.value) }))
          }
          className="mt-1 w-full rounded border p-2"
        />
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full rounded bg-primary p-2 text-white disabled:opacity-50"
      >
        {mutation.isPending ? 'Evaluating...' : 'Evaluate Growth'}
      </button>

      {mutation.error && (
        <div className="rounded bg-red-50 p-3 text-sm text-red-700">
          {mutation.error.message}
        </div>
      )}
    </form>
  );
}
```

### 2. WHO Growth Results Display Component

```typescript
// fe/src/components/card/who-growth-result.tsx

'use client';

import { WhoGrowthEvaluationResponse } from '@/types/who.types';
import { AlertCircle, CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';

interface WhoGrowthResultProps {
  evaluation: WhoGrowthEvaluationResponse;
}

export default function WhoGrowthResult({ evaluation }: WhoGrowthResultProps) {
  const { classification, calculation, recommendation } = evaluation;

  // Color coding based on risk level
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'CRITICAL':
        return 'bg-red-100 border-red-300 text-red-900';
      case 'HIGH':
        return 'bg-orange-100 border-orange-300 text-orange-900';
      case 'MODERATE':
        return 'bg-yellow-100 border-yellow-300 text-yellow-900';
      case 'LOW':
        return 'bg-green-100 border-green-300 text-green-900';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-900';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'CRITICAL':
        return <AlertOctagon className="h-6 w-6 text-red-600" />;
      case 'HIGH':
        return <AlertTriangle className="h-6 w-6 text-orange-600" />;
      case 'NORMAL':
      case 'LOW':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-4 rounded-lg bg-white p-6 shadow">
      {/* Status Card */}
      <div className={`rounded-lg border-2 p-4 ${getRiskColor(recommendation.riskLevel)}`}>
        <div className="flex items-center gap-3">
          {getRiskIcon(recommendation.riskLevel)}
          <div>
            <h3 className="font-semibold">Status Pertumbuhan</h3>
            <p className="text-sm">
              {classification.stuntingStatus === 'SEVERELY_STUNTED' && 'Sangat Pendek (Urgent)'}
              {classification.stuntingStatus === 'STUNTED' && 'Pendek (Risk Tinggi)'}
              {classification.stuntingStatus === 'NORMAL' && 'Normal'}
              {classification.stuntingStatus === 'TALL' && 'Tinggi'}
            </p>
          </div>
        </div>
      </div>

      {/* Z-Score Display */}
      <div className="rounded-lg bg-gray-50 p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-600">Z-Score</p>
            <p className="text-2xl font-bold">{calculation.zScore}</p>
            <p className="text-xs text-gray-600">{calculation.closestSD}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-600">% of Median</p>
            <p className="text-2xl font-bold">{classification.percentageOfMedian.toFixed(1)}%</p>
            <p className="text-xs text-gray-600">Reference: {calculation.median.toFixed(1)} cm</p>
          </div>
        </div>
      </div>

      {/* Risk Level & Follow-up */}
      <div className="rounded-lg bg-blue-50 p-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Risk Level</span>
            <span className={`inline-block rounded px-2 py-1 text-sm font-semibold`}>
              {recommendation.riskLevel}
            </span>
          </div>
          {recommendation.followUpInDays && (
            <div className="flex justify-between">
              <span className="font-medium">Follow-up dalam</span>
              <span className="text-sm">{recommendation.followUpInDays} hari</span>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-2">
        <h4 className="font-semibold">Rekomendasi</h4>
        <ul className="space-y-2">
          {recommendation.actions.map((action, idx) => (
            <li key={idx} className="flex gap-2 text-sm">
              <span className="font-bold text-primary">•</span>
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Referral Notice */}
      {recommendation.referralNeeded && (
        <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
          <p className="font-semibold text-red-900">⚠️ Perlu Rujukan</p>
          <p className="text-sm text-red-800">
            Anak ini memerlukan evaluasi lebih lanjut dari tenaga kesehatan profesional.
          </p>
        </div>
      )}

      {/* Traceability Info (for debugging) */}
      <details className="text-xs text-gray-600">
        <summary className="cursor-pointer font-semibold">Technical Details</summary>
        <div className="mt-2 space-y-1 rounded bg-gray-100 p-2">
          <p>Rule: {evaluation.traceability.rule}</p>
          <p>Source: {evaluation.traceability.source}</p>
          <p>Dataset: {evaluation.traceability.dataset}</p>
          <p>Evaluated: {new Date(evaluation.metadata.evaluatedAt).toLocaleString()}</p>
        </div>
      </details>
    </div>
  );
}
```

### 3. Growth History Chart Component

```typescript
// fe/src/components/chart/growth-history.tsx

'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMeasurementHistory } from '@/hooks/mutation/who/useWhoGrowthEvaluation';

interface GrowthHistoryChartProps {
  childId: string;
}

export default function GrowthHistoryChart({ childId }: GrowthHistoryChartProps) {
  const { data, isLoading, error } = useMeasurementHistory(childId);

  if (isLoading) return <p>Loading measurements...</p>;
  if (error) return <p>Error loading measurements</p>;

  if (!data?.data || data.data.length === 0) {
    return <p className="text-center text-gray-500">No measurements yet</p>;
  }

  // Transform data for chart
  const chartData = data.data
    .sort((a: any, b: any) => new Date(a.measurementDate).getTime() - new Date(b.measurementDate).getTime())
    .map((m: any) => ({
      date: new Date(m.measurementDate).toLocaleDateString(),
      height: m.heightCm,
      weight: m.weightKg,
    }));

  return (
    <div className="rounded-lg bg-white p-6">
      <h3 className="mb-4 font-semibold">Growth Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" label={{ value: 'Height (cm)', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'Weight (kg)', angle: 90, position: 'insideRight' }} />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="height" stroke="#8884d8" name="Height (cm)" />
          <Line yAxisId="right" type="monotone" dataKey="weight" stroke="#82ca9d" name="Weight (kg)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

### 4. Full Page Integration

```typescript
// fe/src/app/(private)/parent/detail-profile-anak/who-evaluation/page.tsx

'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import WhoGrowthForm from '@/components/section/private/parent/who-growth-form';
import WhoGrowthResult from '@/components/card/who-growth-result';
import GrowthHistoryChart from '@/components/chart/growth-history';
import { WhoGrowthEvaluationResponse } from '@/types/who.types';

export default function WhoEvaluationPage() {
  const params = useParams();
  const childId = params.id as string;
  const [evaluation, setEvaluation] = useState<WhoGrowthEvaluationResponse | null>(null);

  return (
    <div className="min-h-screen space-y-6 p-4">
      <h1 className="text-3xl font-bold">Evaluasi Pertumbuhan WHO</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form on left */}
        <div>
          <h2 className="mb-4 font-semibold">Masukkan Data Pengukuran</h2>
          <WhoGrowthForm
            childId={childId}
            childName="Anak Anda"
            onSuccess={setEvaluation}
          />
        </div>

        {/* Results on right */}
        {evaluation && (
          <div>
            <h2 className="mb-4 font-semibold">Hasil Evaluasi</h2>
            <WhoGrowthResult evaluation={evaluation} />
          </div>
        )}
      </div>

      {/* Growth history chart */}
      <div>
        <h2 className="mb-4 font-semibold">Riwayat Pertumbuhan</h2>
        <GrowthHistoryChart childId={childId} />
      </div>
    </div>
  );
}
```

---

## 🔌 Integration Checklist

- ✅ Import types from backend
- ✅ Create custom hooks for WHO evaluation
- ✅ Create form component for input
- ✅ Create result display component
- ✅ Create chart component for history
- ✅ Integrate with existing child profile page
- ✅ Handle loading/error states
- ✅ Add to mobile-first responsive design
- ✅ Cache results in React Query
- ✅ Add to PWA offline support (future)

---

## 📊 Display Guidelines

### Risk Level Color Scheme

```
CRITICAL   → Red (#EF4444)      → Immediate action needed
HIGH       → Orange (#F97316)   → Close monitoring required
MODERATE   → Yellow (#EAB308)   → Regular follow-up
LOW        → Green (#22C55E)    → Continue current practices
NORMAL     → Blue (#3B82F6)     → Routine care
```

### Icons for Status

```
CRITICAL    🚨 AlertOctagon
HIGH        ⚠️ AlertTriangle
LOW/NORMAL  ✅ CheckCircle
TALL        📈 Trending Up
STUNTED     📉 Trending Down
```

---

## 🌐 Responsive Design

### Mobile (< 640px)

```
┌─────────────────┐
│  Form           │
├─────────────────┤
│  Results        │
├─────────────────┤
│  Growth Chart   │
└─────────────────┘
```

### Tablet (640px - 1024px)

```
┌──────────────┬──────────────┐
│   Form       │   Results    │
├──────────────┴──────────────┤
│     Growth Chart             │
└──────────────────────────────┘
```

### Desktop (> 1024px)

```
Same as tablet but with more spacing
```

---

## 🔄 State Management

### Using TanStack Query

```typescript
const evaluationQuery = useWhoGrowthEvaluation();

// State
evaluationQuery.isPending; // Loading state
evaluationQuery.isError; // Error state
evaluationQuery.data; // Result data
evaluationQuery.error; // Error object

// Actions
evaluationQuery.mutate(); // Non-blocking
evaluationQuery.mutateAsync(); // Async/await
evaluationQuery.reset(); // Clear state
```

---

## 🧪 Testing Example

```typescript
// fe/src/__tests__/who-growth.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WhoGrowthForm from '@/components/section/private/parent/who-growth-form';

describe('WhoGrowthForm', () => {
  it('should evaluate normal growth', async () => {
    const onSuccess = jest.fn();
    render(
      <WhoGrowthForm
        childId="test-id"
        childName="Test Child"
        onSuccess={onSuccess}
      />
    );

    // Fill form
    fireEvent.change(screen.getByLabelText('Usia (bulan)'), {
      target: { value: '24' },
    });

    fireEvent.change(screen.getByLabelText('Tinggi (cm)'), {
      target: { value: '87.0' },
    });

    // Submit
    fireEvent.click(screen.getByText('Evaluate Growth'));

    // Wait for result
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
```

---

## 📱 Progressive Web App Features

### Offline Support (Future)

```typescript
// Cache WHO evaluation results
if ("caches" in window) {
  const cache = await caches.open("who-evaluations-v1");
  cache.put(cacheKey, new Response(JSON.stringify(evaluation)));
}
```

### Push Notifications

```typescript
// Notify parent of follow-up due
if (recommendation.followUpInDays <= 7) {
  showNotification({
    title: "Growth Check-up Due",
    body: `Time to schedule ${childName}'s growth evaluation`,
  });
}
```

---

## 🔐 Security Notes

- ✅ Always include JWT token in request headers
- ✅ Validate token expiry before making requests
- ✅ Don't expose API URLs in frontend code (use env vars)
- ✅ Use HTTPS in production
- ✅ Implement rate limiting on frontend (debounce/throttle)

---

## 📚 Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)
- [Recharts Documentation](https://recharts.org/)
- Backend API: `be/WHO_GROWTH_API.md`
- Implementation Details: `be/WHO_GROWTH_IMPLEMENTATION.md`

---

**Frontend integration complete and ready for development!** ✨
