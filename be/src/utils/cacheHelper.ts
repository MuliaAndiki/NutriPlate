import { getRedis } from '@/utils/redis';
import { cacheKeys } from '@/cache/cacheKey';

/**
 * Invalidate multiple cache keys at once
 * @param keys - Array of cache keys to delete
 */
export async function invalidateCache(keys: string[] | string) {
  const redis = getRedis();
  const keyArray = Array.isArray(keys) ? keys : [keys];

  if (keyArray.length === 0) return;

  try {
    await redis.del(keyArray);
  } catch (error) {
    console.warn(`Cache invalidation error:`, error);
  }
}

/**
 * Resolve cache key based on user role
 * PARENT → cache by userId
 * POSYANDU → cache by posyanduId
 * KADER → resolve via posyandu relationship
 * ADMIN → cache global (list)
 */
type ResourceType = 'program' | 'progress' | 'task' | 'notification' | 'child' | 'history';

export function resolveCacheKeyByRole(params: {
  role: 'PARENT' | 'POSYANDU' | 'KADER' | 'ADMIN';
  resource: ResourceType;
  userId?: string;
  posyanduId?: string;
}) {
  const { role, resource, userId, posyanduId } = params;

  switch (role) {
    case 'PARENT':
      if (resource === 'program' && userId) {
        return cacheKeys.program.byUser(userId);
      }
      return cacheKeys[resource].list();

    case 'POSYANDU':
    case 'KADER':
      if (!posyanduId) return null;

      switch (resource) {
        case 'program':
          return cacheKeys.program.byPosyandu(posyanduId);
        case 'child':
          return cacheKeys.child.byPosyandu(posyanduId);
        default:
          return cacheKeys[resource].list();
      }

    case 'ADMIN':
      return cacheKeys[resource].list();

    default:
      return null;
  }
}
/**
 * Get all related cache keys that need invalidation on resource changes
 */
export function getRelatedCacheKeys(resourceType: string, id?: string, parentId?: string) {
  const keys: string[] = [];

  switch (resourceType) {
    case 'user':
      if (id) keys.push(cacheKeys.user.byID(id));
      keys.push(cacheKeys.user.list());
      break;

    case 'child':
      if (id) keys.push(cacheKeys.child.byID(id));
      if (parentId) keys.push(cacheKeys.child.byParent(parentId));
      keys.push(cacheKeys.child.list());
      break;

    case 'program':
      if (id) keys.push(cacheKeys.program.byID(id));
      keys.push(cacheKeys.program.list());
      break;

    case 'progress':
      if (id) keys.push(cacheKeys.progress.byID(id));
      keys.push(cacheKeys.progress.list());
      break;

    case 'notification':
      if (id) keys.push(cacheKeys.notification.byID(id));
      keys.push(cacheKeys.notification.list());
      break;

    case 'task':
      if (id) keys.push(cacheKeys.task.byID(id));
      keys.push(cacheKeys.task.list());
      break;

    case 'measurement':
      if (id) keys.push(cacheKeys.measurement.byChild(id));
      keys.push(cacheKeys.measurement.list());
      break;

    case 'evaluation':
      if (id) keys.push(cacheKeys.evaluation.byChild(id));
      keys.push(cacheKeys.evaluation.list());
      break;

    case 'posyandu':
      if (id) keys.push(cacheKeys.posyandu.byID(id));
      keys.push(cacheKeys.posyandu.list());
      break;

    default:
      break;
  }

  return keys;
}
