import { Route } from '@angular/router';
import { LayoutComponent } from '@client/layout';
import { AuthGuard } from '@client/guard/auth';

export const appRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('@client/chat/chatting-screen').then(
            (c) => c.ChattingScreenComponent
          ),
      },
      {
        path: 'me',
        children: [
          {
            path: '',
            canActivate: [AuthGuard],
            loadComponent: () =>
              import('@client/profile').then((c) => c.ProfileComponent),
          },
        ],
      },
    ],
  },
  {
    path: 'user',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@client/user').then((c) => c.UserFeatureComponent),
      },
    ],
  },
  // PageNotFound route as a global fallback
  {
    path: '**',
    loadComponent: () =>
      import('@client/ui/page-not-found').then((c) => c.PageNotFoundComponent),
  },
];
