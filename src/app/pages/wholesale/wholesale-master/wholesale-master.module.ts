import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WholesaleMasterRoutingModule } from './wholesale-master.routing';
import { WholesaleMasterComponent } from './wholesale-master.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CostCentreMetalComponent } from './cost-centre-metal/cost-centre-metal.component';
import { CostcentreMagkingchargesComponent } from './costcentre-magkingcharges/costcentre-magkingcharges.component';
import { CostcentreConsumableComponent } from './costcentre-consumable/costcentre-consumable.component';
import { MetalStockMasterComponent } from './metal-stock-master/metal-stock-master.component';
import { KaratMasterComponent } from './karat-master/karat-master.component';
import { RateTypeComponent } from './rate-type/rate-type.component';
import { MetalDivisionMasterComponent } from './metal-division-master/metal-division-master.component';
import { MetalPrefixMasterComponent } from './metal-prefix-master/metal-prefix-master.component';
import { DiamondPrefixMasterComponent } from './diamond-prefix-master/diamond-prefix-master.component';
import { DesignMasterComponent } from './design-master/design-master.component';
import { LooseStoneMasterComponent } from './loose-stone-master/loose-stone-master.component';
import { ColorStoneMasterComponent } from './color-stone-master/color-stone-master.component';
import { WatchMasterComponent } from './watch-master/watch-master.component';
import { ConsumableMasterComponent } from './consumable-master/consumable-master.component';
import { ManufacturedItemsComponent } from './manufactured-items/manufactured-items.component';
import { ComponentSizeMasterComponent } from './component-size-master/component-size-master.component';
import { ComponentSizeSetComponent } from './component-size-set/component-size-set.component';


@NgModule({
  declarations: [
    WholesaleMasterComponent,
    CostCentreMetalComponent,
    CostcentreMagkingchargesComponent,
    CostcentreConsumableComponent,
    MetalStockMasterComponent,
    KaratMasterComponent,
    RateTypeComponent,
    MetalDivisionMasterComponent,
    MetalPrefixMasterComponent,
    DiamondPrefixMasterComponent,
    DesignMasterComponent,
    LooseStoneMasterComponent,
    ColorStoneMasterComponent,
    WatchMasterComponent,
    ConsumableMasterComponent,
    ManufacturedItemsComponent,
    ComponentSizeMasterComponent,
    ComponentSizeSetComponent,
  ],
  imports: [
    CommonModule,
    WholesaleMasterRoutingModule,
    SharedModule
  ]
})
export class WholesaleMasterModule { }
