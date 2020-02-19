import { ProductComponent } from './product/product.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderButtonsComponent } from './header-buttons/header-buttons.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [HeaderButtonsComponent, ProductComponent],
  entryComponents: [ProductComponent],
  imports: [
    CommonModule,
    IonicModule.forRoot({
      rippleEffect: false,
      mode: 'md'
    }),
  ],
  exports: [
    HeaderButtonsComponent, ProductComponent
  ]
})
export class ComponentsModule { }
