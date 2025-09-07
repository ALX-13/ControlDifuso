import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../envs/enviroment';
import { Interview, CreateInterviewRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  private apiUrl = `${environment.apiUrl}/interviews`;

  constructor(private http: HttpClient) {}

  getInterviews(): Observable<Interview[]> {
    return this.http.get<Interview[]>(this.apiUrl);
  }

  getInterviewById(id: string): Observable<Interview> {
    return this.http.get<Interview>(`${this.apiUrl}/${id}`);
  }

  createInterview(interview: CreateInterviewRequest): Observable<Interview> {
    return this.http.post<Interview>(this.apiUrl, interview);
  }

  updateInterview(id: string, interview: Partial<CreateInterviewRequest>): Observable<Interview> {
    return this.http.put<Interview>(`${this.apiUrl}/${id}`, interview);
  }

  deleteInterview(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
