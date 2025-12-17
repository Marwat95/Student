import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowseCourses } from './browse-courses';

describe('BrowseCourses', () => {
    let component: BrowseCourses;
    let fixture: ComponentFixture<BrowseCourses>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BrowseCourses]
        })
            .compileComponents();

        fixture = TestBed.createComponent(BrowseCourses);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
