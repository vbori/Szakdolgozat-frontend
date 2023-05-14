import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Error404Component } from './error404.component';

describe('Error404Component', () => {
  let component: Error404Component;
  let fixture: ComponentFixture<Error404Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Error404Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Error404Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a h1 tag with the text "Error 404: Experiment not found"', () => {
    expect(fixture.nativeElement.querySelector('h1').textContent).toEqual('Error 404: Experiment not found');
  });
});
