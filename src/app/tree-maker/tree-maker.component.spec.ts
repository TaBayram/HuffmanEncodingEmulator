import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeMakerComponent } from './tree-maker.component';

describe('TreeMakerComponent', () => {
  let component: TreeMakerComponent;
  let fixture: ComponentFixture<TreeMakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreeMakerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
