import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ParticipantDescriptionComponent } from './participant-description.component';

describe('ParticipantDescriptionComponent', () => {
  let component: ParticipantDescriptionComponent;
  let fixture: ComponentFixture<ParticipantDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantDescriptionComponent ],
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        MatCheckboxModule,
        ReactiveFormsModule,
        FormsModule
      ],
      providers: [ToastrService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
