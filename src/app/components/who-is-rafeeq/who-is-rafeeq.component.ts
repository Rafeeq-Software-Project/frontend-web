import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-who-is-rafeeq',
  standalone: true,
  imports: [RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './who-is-rafeeq.component.html',
  styleUrls: ['./who-is-rafeeq.component.css']
})
export class WhoIsRafeeqComponent {

}
