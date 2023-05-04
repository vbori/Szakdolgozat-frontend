import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ExperimentBasicsComponent } from './experiment-basics.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ExperimentBasicsComponent', () => {
  let component: ExperimentBasicsComponent;
  let fixture: ComponentFixture<ExperimentBasicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperimentBasicsComponent ],
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatSelectModule,
        ReactiveFormsModule,
        FormsModule,
        NoopAnimationsModule
      ],
      providers: [ToastrService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperimentBasicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
