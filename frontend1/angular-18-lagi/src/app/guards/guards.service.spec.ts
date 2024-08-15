import { TestBed } from '@angular/core/testing';

import { GuardsService } from './guards.service';

describe('GuardsService', () => {
  let service: GuardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuardsService); //guardservice
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
