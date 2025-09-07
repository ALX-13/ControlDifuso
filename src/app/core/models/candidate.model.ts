export interface Candidate {
  _id: string;
  name: string;
  party: string;
  bio: string;
  photoUrl?: string;
  proposals: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCandidateRequest {
  name: string;
  party: string;
  bio: string;
  photoUrl?: string;
  proposals?: string[];
}
