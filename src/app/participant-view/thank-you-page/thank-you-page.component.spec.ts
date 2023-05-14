import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule} from '@angular/router/testing';
import { ThankYouPageComponent } from './thank-you-page.component';

describe('ThankYouPageComponent', () => {
  let component: ThankYouPageComponent;
  let fixture: ComponentFixture<ThankYouPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThankYouPageComponent ],
      imports: [RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThankYouPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have "Back to experiment overview" button when in demo mode', () => {
    component.demoMode = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#back-btn')).toBeTruthy();
  });

  it('should not have "Back to experiment overview" button when not in demo mode', () => {
    component.demoMode = false;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#back-btn')).toBeFalsy();
  });

  it('should create an h1 element with the text "Thank you!"', () => {
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toEqual('Thank you!');
  });
});
