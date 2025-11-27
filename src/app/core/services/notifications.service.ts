import { Injectable } from '@angular/core';
import { Notification } from '../models/notification.model';
import * as signalR from '@microsoft/signalr';
import { HttpTransportType } from '@microsoft/signalr';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  apiUrl: string = environment.apiUrl;

  // Holds the SignalR hub connection object
  private hubConnection: signalR.HubConnection | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Starts a SignalR connection to the server for real-time notifications.
   */
  startConnection() {
    const token =
      localStorage !== undefined
        ? localStorage.getItem('accessToken') || ''
        : '';

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.apiUrl}/notification`, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
        accessTokenFactory: () => token, // Passes the token for authentication
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => {
        this.sendMessage(); // Once the connection is established, send a message
      })
      .catch(() => {});
  }

  onReceiveMessages(callback: (notification: Notification) => void) {
    this.hubConnection?.on('ReceiveNotifications', callback);
  }

  onReceiveMessage(callback: (notification: Notification) => void) {
    this.hubConnection?.on('ReceiveNotification', callback);
  }

  /**
   * Sends a request to the SignalR hub to get notifications.
   */
  sendMessage() {
    this.hubConnection?.invoke('GetNotification').catch(() => {});
  }

  /**
   * Stops the SignalR connection.
   */
  stopConnection() {
    this.hubConnection?.stop().then(() => {});
  }

  /**
   * Marks a notification as read.
   * @param id - The ID of the notification to be marked as read.
   * @returns Observable that emits the response status.
   */
  updateRead(id: number): Observable<string> {
    const payload = { id: id, isRead: true };
    return this.http.put<string>(
      `${this.apiUrl}/api/Notification/update`,
      payload
    );
  }

  getDashboardDetails(): Observable<ApiResponse[]> {
    return this.http.get<ApiResponse[]>(`${this.apiUrl}/api/Dashboard/status`);
  }

  sendPlanIdToGet(planId: number) {
    this.hubConnection
      ?.invoke('JoinPlanGroup', planId.toString())
      .catch(() => {});
  }

  sendPlanIdToLeave(planId: number) {
    this.hubConnection
      ?.invoke('LeavePlanGroup', planId.toString())
      .catch(() => {});
  }

  onDashBoardPlanUpdate(callback: (apiResponse: any) => void) {
    this.hubConnection?.on('DashBoardPlanDetail', callback);
  }

  onDashBoardUpdate(callback: (apiResponse: ApiResponse[]) => void) {
    this.hubConnection?.on('DashBoardDetail', callback);
  }
}
