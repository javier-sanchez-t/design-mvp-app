import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProjectCComponent } from './new-project-c.component';

describe('NewProjectCComponent', () => {
  let component: NewProjectCComponent;
  let fixture: ComponentFixture<NewProjectCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewProjectCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProjectCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
