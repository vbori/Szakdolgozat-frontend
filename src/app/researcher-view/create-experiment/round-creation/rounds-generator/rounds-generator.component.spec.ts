import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { RoundsGeneratorComponent } from './rounds-generator.component';

describe('RoundsGeneratorComponent', () => {
  let component: RoundsGeneratorComponent;
  let fixture: ComponentFixture<RoundsGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundsGeneratorComponent ],
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        FormsModule,
        MatSelectModule,
        NoopAnimationsModule
      ],
      providers: [ToastrService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoundsGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
