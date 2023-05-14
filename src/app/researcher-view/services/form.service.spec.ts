import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormService } from './form.service';
import { environment } from 'src/environments/environment';
import { QuestionType } from 'src/app/common/models/form.model';

describe('FormService', () => {
  let service: FormService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FormService]
    });
    service = TestBed.inject(FormService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getForm', () => {
    it('should make a GET request to the getForm endpoint', () => {
      const experimentId = '1';
      const form = { id: '1', name: 'Test Form', questions: [] };

      service.getForm(experimentId).subscribe();

      const req = httpMock.expectOne(`${environment.baseUrl}/research/getForm?experimentId=${experimentId}`);
      expect(req.request.method).toBe('GET');
      req.flush(form);
    });
  });

  describe('addForm', () => {
    it('should make a POST request to the addForm endpoint', () => {
      const experimentId = '1';
      const questions = [{ questionId: 'question1', label: 'Question 1', type: 'text' as QuestionType, required: true }, { questionId: 'question2', label: 'Question 2', type: 'number' as QuestionType, required: true }];

      service.addForm(experimentId, questions).subscribe();

      const req = httpMock.expectOne(`${environment.baseUrl}/research/addForm`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ experimentId, questions });
    });
  });

  describe('updateForm', () => {
    it('should make a PATCH request to the editForm endpoint', () => {
      const experimentId = '1';
      const questions = [{ questionId: 'question1', label: 'Question 1', type: 'text' as QuestionType, required: true }, { questionId: 'question2', label: 'Question 2', type: 'number' as QuestionType, required: true }];

      service.updateForm(experimentId, questions).subscribe();

      const req = httpMock.expectOne(`${environment.baseUrl}/research/editForm`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ experimentId, questions });
    });
  });

  describe('deleteForm', () => {
    it('should make a DELETE request to the deleteForm endpoint', () => {
      const experimentId = '1';

      service.deleteForm(experimentId).subscribe();

      const req = httpMock.expectOne(`${environment.baseUrl}/research/deleteForm?experimentId=${experimentId}`);
      expect(req.request.method).toBe('DELETE');
    });
  });
});
