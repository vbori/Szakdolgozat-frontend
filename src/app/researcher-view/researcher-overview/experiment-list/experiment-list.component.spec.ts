import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import { ExperimentListComponent } from './experiment-list.component';

describe('ExperimentListComponent', () => {
  let component: ExperimentListComponent;
  let fixture: ComponentFixture<ExperimentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperimentListComponent ],
      imports: [HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [ToastrService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperimentListComponent);
    component = fixture.componentInstance;
    component.experimentStatus = 'Active'
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show "Looks like you don\'t have any active experiments yet!" when no active experiments are available', () => {
    component.experiments = [];
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#no-experiments-msg')).toBeTruthy();
  });
});
