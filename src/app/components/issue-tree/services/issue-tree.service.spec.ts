import { TestBed } from '@angular/core/testing';

import { IssueTreeService } from './issue-tree.service';

describe('IssueTreeService', () => {
  let service: IssueTreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssueTreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
