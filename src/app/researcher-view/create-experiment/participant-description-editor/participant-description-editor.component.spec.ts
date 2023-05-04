import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ParticipantDescriptionEditorComponent } from './participant-description-editor.component';

describe('ParticipantDescriptionEditorComponent', () => {
  let component: ParticipantDescriptionEditorComponent;
  let fixture: ComponentFixture<ParticipantDescriptionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantDescriptionEditorComponent ],
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot({positionClass :'toast-bottom-right'}),
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        NoopAnimationsModule],
      providers: [
        {provide: ToastrService, useClass: ToastrService}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantDescriptionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
