import { TestBed } from '@angular/core/testing';

import { CloudMessageService } from './cloud-message.service';

describe('CloudMessageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CloudMessageService = TestBed.get(CloudMessageService);
    expect(service).toBeTruthy();
  });
});
