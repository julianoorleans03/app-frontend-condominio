import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  versao: string = "1.0.0";
  
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

}
