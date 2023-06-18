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
  },  {
    path: 'add-member-post',
    loadComponent: () => import('./pages/add-member-post/add-member-post.page').then( m => m.AddMemberPostPage)
  },
  {
    path: 'post',
    loadComponent: () => import('./pages/post/post.page').then( m => m.PostPage)
  },
  {
    path: 'like-list',
    loadComponent: () => import('./pages/popover/like-list/like-list.page').then( m => m.LikeListPage)
  }

];
