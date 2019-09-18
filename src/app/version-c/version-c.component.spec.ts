import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionCComponent } from './version-c.component';

describe('VersionCComponent', () => {
  let component: VersionCComponent;
  let fixture: ComponentFixture<VersionCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VersionCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
