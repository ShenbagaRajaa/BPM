import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewEncapsulation,
  signal,
  HostListener,
  ElementRef,
  PLATFORM_ID,
  Inject,
  NgZone,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule, isPlatformBrowser, NgClass } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../core/store/auth-state/auth.selector';
import {
  BehaviorSubject,
  forkJoin,
  map,
  Subject,
  Subscription,
  takeUntil,
} from 'rxjs';
import { addUserModel } from '../../../core/models/UserCreationTemp.model';
import { Notification } from '../../../core/models/notification.model';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationsService } from '../../../core/services/notifications.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../environment/environment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Actions, ofType } from '@ngrx/effects';
import {
  deleteUser,
  deleteUserSuccess,
  updateUserSuccess,
} from '../../../core/store/user-state/user.action';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { NotificationComponent } from '../../../shared/notification/notification.component';
import { getConfiguration } from '../../../core/store/configuration-settings-state/configuration-settings.action';
import { selectConfiguration } from '../../../core/store/configuration-settings-state/configuration-settings.selector';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../build-br-plan/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatBadgeModule,
    RouterModule,
    MatFormFieldModule,
    FormsModule,
    MatExpansionModule,
    NgClass,
  ],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ToolbarComponent implements OnInit {
  @Output() toogleDrawer = new EventEmitter<boolean>();

  private destroy$ = new Subject<void>();
  currentUser!: addUserModel;
  notifications$ = new BehaviorSubject<Notification[]>([]);
  notificationsDisplay$ = new BehaviorSubject<Notification[]>([]);
  notificationsOpen = false;
  profilePath!: string;
  name: string = '';
  profilePath$ = new BehaviorSubject<string>('');
  name$ = new BehaviorSubject<string>('');
  userInitials$ = new BehaviorSubject<string>('');
  apiUrl = environment.apiUrl + '/';
  private subscriptions: Subscription[] = [];
  readonly panelOpenState = signal(false);
  count: number = 0;
  acknowledgeMaxTime: number = 5;

  constructor(
    private router: Router,
    private store: Store,
    private authService: AuthService,
    private notificationService: NotificationsService,
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef,
    private actions$: Actions,
    private elementRef: ElementRef,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object,
    private dialog : MatDialog
  ) {}

  ngOnInit() {
    // Fetch current user data from the store
    this.store
      .select(selectUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data?.user) {
          this.currentUser = data.user;

          this.name$.next(
            data.user.employeeFirstName + ' ' + data.user.employeeLastName || ''
          );

          const path = data.user.uploadPhotoPath
            ? `${environment.apiUrl}/${data.user.uploadPhotoPath}`
            : '';
          this.profilePath$.next(path);
          this.cdRef.detectChanges();

          const initials = this.generateInitials(data.user.employeeFirstName);
          this.userInitials$.next(initials);
        }
      });

    if (isPlatformBrowser(this.platformId)) {
      this.notificationService.startConnection();
    }

    this.actions$
      .pipe(ofType(updateUserSuccess), takeUntil(this.destroy$))
      .subscribe(() => {
        this.initializeUserSubscription();
      });

    this.actions$
      .pipe(ofType(deleteUserSuccess), takeUntil(this.destroy$))
      .subscribe(() => {
        this.router.navigate(['/login']);
      });

    this.getNotification();
    this.getAllNotifications();
  }

  getNotification() {
    // Listen to incoming notifications and update notification list
    this.notificationService.onReceiveMessage((notification: Notification) => {
      const currentNotifications = this.notifications$.value;
      this.showNotificationToast(notification);

      const allNotifications = [notification, ...currentNotifications];
      this.scheduleMarkAsRead(notification);

      const priorityOrder: { [key: string]: number } = {
        High: 1,
        Medium: 2,
        Low: 3,
      };

      const sortedNotifications = allNotifications.sort((a, b) => {
        // Sort by `isRead` (unread first)
        if (a.isRead !== b.isRead) {
          return a.isRead ? 1 : -1;
        }
        // Sort by `priority` (high > medium > low)
        const aPriority = priorityOrder[a.priority] ?? 4; // Fallback if `priority` is not in `priorityOrder`
        const bPriority = priorityOrder[b.priority] ?? 4;
        return aPriority - bPriority;
      });

      // Update observables with reordered notifications
      this.notifications$.next(sortedNotifications);
      this.notificationsDisplay$.next(sortedNotifications);
    });
  }

  getAllNotifications() {
    // Fetch and process all notifications
    this.notificationService.onReceiveMessages(
      (notification: Notification | Notification[]) => {
        let updatedNotifications: Notification[] = [];
        if (Array.isArray(notification)) {
          updatedNotifications = notification;
        } else {
          updatedNotifications = [notification];
        }
        // Schedule auto-read for notifications with URLs
        updatedNotifications.forEach((n) => this.scheduleMarkAsRead(n));

        // Combine and reorder notifications
        const allNotifications = [...updatedNotifications];

        const priorityOrder: { [key: string]: number } = {
          High: 1,
          Medium: 2,
          Low: 3,
        };

        const sortedNotifications = allNotifications.sort((a, b) => {
          // Sort by `isRead` (unread first)
          if (a.isRead !== b.isRead) {
            return a.isRead ? 1 : -1;
          }
          // Sort by `priority` (high > medium > low)
          const aPriority = priorityOrder[a.priority] ?? 4; // Fallback if `priority` is not in `priorityOrder`
          const bPriority = priorityOrder[b.priority] ?? 4;
          return aPriority - bPriority;
        });

        // Update observables with reordered notifications
        this.notifications$.next(sortedNotifications);
        this.notificationsDisplay$.next(sortedNotifications);
      }
    );
  }

  scheduleMarkAsRead(notification: Notification) {
    if (notification.isRead || !notification.linkURL) return; // Skip if already read or no URL

    const receivedTime = new Date(notification.createdDate).getTime();
    const elapsedTime = Date.now() - receivedTime;
    const delay = Math.max(
      this.acknowledgeMaxTime * 60 * 1000 - elapsedTime,
      0
    ); // Ensure non-negative delay

    setTimeout(() => {
      this.notificationService.updateRead(notification.id).subscribe(() => {
        const updatedNotifications = this.notifications$.value.map((n) =>
          n.id === notification.id ? { ...n, isRead: true } : n
        );
        this.notifications$.next(updatedNotifications);
        this.notificationsDisplay$.next(updatedNotifications);
      });
    }, delay);
  }

  getAcknowledgeMaxTime() {
    this.store.dispatch(getConfiguration({ id: 1 }));
    this.store.select(selectConfiguration).subscribe((config) => {
      if (config) {
        this.acknowledgeMaxTime = parseInt(config.value.toString());
      }
    });
  }

  private initializeUserSubscription(): void {
    // Subscribe to store changes and update user data
    const userSub = this.store.select(selectUser).subscribe((data) => {
      if (data?.user) {
        this.currentUser = data.user;
        this.cdRef.detectChanges();
      }
    });
    this.subscriptions.push(userSub);
  }
  get userInitials(): string {
    return this.currentUser?.employeeFirstName
      ? this.currentUser.employeeFirstName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
      : '';
  }
  get profilePhotoUrl(): string {
    if (this.currentUser?.uploadPhotoPath) {
      return `${this.apiUrl}${this.currentUser.uploadPhotoPath}`;
    }
    return '';
  }

  get unreadCount(): number {
    // Get the count of unread notifications
    return this.notifications$.value.filter((n) => !n.isRead).length;
  }

  get readCount(): number {
    // Get the count of read notifications
    return this.notifications$.value.filter((n) => n.isRead).length;
  }

  private generateInitials(name: string): string {
    // Generate initials from user's full name
    return name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
      : '';
  }

  toggleDrawer() {
    this.toogleDrawer.emit(true);
  }

  toggleNotifications() {
    this.notificationsOpen = !this.notificationsOpen;
    this.getAllNotifications();
  }

  onTouchStart(event: TouchEvent) {
    // Prevent default behavior to avoid any iOS-specific issues
    event.preventDefault();
    this.toggleNotifications();
  }

  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent) {
    // Close notifications panel if clicked outside
    if (
      this.notificationsOpen &&
      !this.elementRef.nativeElement.contains(event.target)
    ) {
      this.notificationsOpen = false;
    }
  }

  @HostListener('document:touchend', ['$event'])
  onOutsideTouchEnd(event: TouchEvent) {
    if (
      this.notificationsOpen &&
      !this.elementRef.nativeElement.contains(event.target)
    ) {
      this.notificationsOpen = false;
    }
  }

  markAsRead(notification: Notification, menuTrigger?: MatMenuTrigger) {
    if (notification.linkURL !== '' && notification.linkURL !== null) {
      const extractedPath = notification.linkURL.substring(
        notification.linkURL.indexOf('/home')
      );
      const parser = document.createElement('a');
      parser.href = extractedPath;

      const pathname = parser.pathname;
      const queryString = parser.search;

      const queryParams = new URLSearchParams(queryString);
      let paramsObj: any = {};
      queryParams.forEach((value, key) => {
        paramsObj[key] = value;
      });
      paramsObj['_'] = new Date().getTime();
      this.router.navigate([pathname], { queryParams: paramsObj });

      this.notificationsOpen = false;
      menuTrigger?.closeMenu();
      const FIFTEEN_MINUTES = 15 * 60 * 1000;
      const currentTime = new Date().getTime();

      const receivedDateObj = new Date(notification.createdDate);
      const receivedTime = receivedDateObj.getTime();
      const timeDiff = currentTime - receivedTime;
      if (timeDiff > FIFTEEN_MINUTES) {
        this.notificationService
          .updateRead(notification.id)
          .pipe(map(() => notification.id));
      }
    } else {
      this.notificationsOpen = true;
      this.notificationService.updateRead(notification.id).subscribe({
        next: () => {
          const updatedNotifications = this.notifications$.value.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
          );
          this.notifications$.next(updatedNotifications);
          this.notificationsDisplay$.next(updatedNotifications);
        },
        error: () => {},
      });
    }
  }

  markAllAsRead() {
    // Mark all notifications as read, with additional conditions
    const FIFTEEN_MINUTES = 15 * 60 * 1000;
    const currentTime = new Date().getTime();

    const updateObservables = this.notifications$.value
      .filter((notification) => {
        const receivedDateObj = new Date(notification.createdDate);
        const receivedTime = receivedDateObj.getTime();
        const timeDiff = currentTime - receivedTime;

        return (
          !notification.isRead &&
          (!notification.linkURL ||
            (notification.linkURL && timeDiff > FIFTEEN_MINUTES))
        );
      })
      .map((notification) =>
        this.notificationService
          .updateRead(notification.id)
          .pipe(map(() => notification.id))
      );

    if (updateObservables.length > 0) {
      forkJoin(updateObservables).subscribe({
        next: (updatedIds) => {
          const notifications = this.notifications$.value.map((n) => ({
            ...n,
            isRead: updatedIds.includes(n.id) ? true : n.isRead,
          }));

          this.notifications$.next(notifications);
          this.notificationsDisplay$.next(notifications);
        },
        error: () => {},
      });
    }
  }

  deleteNotification(notification: Notification) {
    // Delete a specific notification
    const updatedNotifications = this.notifications$.value.filter(
      (n) => n.id !== notification.id
    );
    this.notifications$.next(updatedNotifications);
  }

  selectedCategory: string = 'All'; // Default category
  showOnlyUnread: boolean = false;

  setCategory(category: boolean): void {
    this.selectedCategory = category === true ? 'Read' : 'Unread';
    const updatedNotifications = this.notifications$.value.filter(
      (n) => n.isRead === category
    );
    this.notificationsDisplay$.next(updatedNotifications);
  }

  showAll(): void {
    this.selectedCategory = 'All';
    const currentNotifications = this.notifications$.value;
    this.notificationsDisplay$.next([...currentNotifications]);
  }

  logout() {
    this.authService.logout();
  }

  showNotificationToast(notification: Notification) {
    // Display toast for incoming notifications
    let sheetRef = this.snackBar.openFromComponent(NotificationComponent, {
      data: notification,
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: 'custom',
    });
    sheetRef.afterDismissed().subscribe((message) => {
      if (message.dismissedByAction) {
        this.notificationsOpen = true;
        this.cdRef.detectChanges();

        const notificationToUpdate = this.notifications$.value.find(
          (n) => n.id === notification.id
        );

        if (notificationToUpdate) {
          this.markAsRead(notificationToUpdate);
        }
      }
    });
  }

  deleteUser() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete',
        message: 'Are you sure do you want to delete your account?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.store.dispatch(deleteUser({ userId :this.currentUser.id }));
      }
    });
  }
  ngOnDestroy() {
    // Cleanup subscriptions on destroy
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions.forEach((sub) => sub?.unsubscribe());
  }
}
