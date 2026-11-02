import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarUsuario } from './avatar-usuario';

describe('AvatarUsuario', () => {
  let component: AvatarUsuario;
  let fixture: ComponentFixture<AvatarUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarUsuario],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarUsuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
