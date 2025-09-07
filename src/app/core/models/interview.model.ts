export interface Interview {
  _id: string;
  title: string;
  interviewer: string;
  interviewee: string;
  transcript: string;
  videoUrl?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInterviewRequest {
  title: string;
  interviewer: string;
  interviewee: string;
  transcript: string;
  videoUrl?: string;
}
