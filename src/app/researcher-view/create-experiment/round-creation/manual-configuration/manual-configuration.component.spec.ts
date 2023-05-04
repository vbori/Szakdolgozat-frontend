import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ManualConfigurationComponent } from './manual-configuration.component';

describe('ManualConfigurationComponent', () => {
  let component: ManualConfigurationComponent;
  let fixture: ComponentFixture<ManualConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualConfigurationComponent ],
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        FormsModule,
        NoopAnimationsModule
      ],
      providers: [
        ToastrService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
