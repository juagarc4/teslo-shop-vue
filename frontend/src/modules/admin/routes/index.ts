import type { RouteRecordRaw } from 'vue-router';
import isAdminGuard from '@/modules/admin/guards/is-admin.guard';
import isAuthenticatedGuard from '@/modules/auth/guards/is-authenticated.guard';

export const adminRoutes: RouteRecordRaw = {
  path: '/admin',
  name: 'admin',
  beforeEnter: [isAuthenticatedGuard, isAdminGuard],
  redirect: { name: 'admin-dashboard' },
  component: () => import('@/modules/admin/layouts/AdminLayout.vue'),
  children: [
    {
      path: 'dashboard',
      name: 'admin-dashboard',
      component: () => import('@/modules/admin/views/DashbardView.vue'),
    },
  ],
};
