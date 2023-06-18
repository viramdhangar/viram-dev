import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./splash/splash.page').then( m => m.SplashPage)
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'like-comment',
    loadComponent: () => import('./pages/popover/like-comment/like-comment.page').then( m => m.LikeCommentPage)
  },
  {
    path: 'birthday-wishes',
    loadComponent: () => import('./pages/popover/birthday-wishes/birthday-wishes.page').then( m => m.BirthdayWishesPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'splash',
    loadComponent: () => import('./splash/splash.page').then( m => m.SplashPage)
  }
];
