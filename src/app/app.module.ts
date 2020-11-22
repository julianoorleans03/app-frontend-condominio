import localePt from "@angular/common/locales/pt";

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID, ErrorHandler } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { FooterComponent } from './footer/footer.component';

import { JwtInterceptor } from "./auth/jwt-interceptor";
import { ToastrModule } from "ngx-toastr";
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { UsuarioComponent } from './usuario/usuario.component';
import { AchadosperdidosComponent } from './achadosperdidos/achadosperdidos.component';
import { AchadosperdidosCadastroComponent } from './achadosperdidos/achadosperdidos-cadastro/achadosperdidos-cadastro.component';
import { ReservaComponent } from './reserva/reserva.component';

import {
  LocationStrategy,
  registerLocaleData,
  HashLocationStrategy,
} from "@angular/common";
import { AppErrorHandler } from './auth/app-error-handler';
import { UsuarioPendenteComponent } from './usuario-pendente/usuario-pendente.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ModalReservaComponent } from './reserva/modal-reserva/modal-reserva.component';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin
])

registerLocaleData(localePt, "pt");

const firebaseConfig = {
  apiKey: "AIzaSyDuPWnsBUL0BA4DyCDram4KPDgDjJgpA2Q",
  authDomain: "condominio-294219.firebaseapp.com",
  databaseURL: "https://condominio-294219.firebaseio.com",
  projectId: "condominio-294219",
  storageBucket: "condominio-294219.appspot.com",
  messagingSenderId: "781068296382",
  appId: "1:781068296382:web:9364c42ac1888178157eef"
};
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    MainComponent,
    FooterComponent,
    UsuarioComponent,
    AchadosperdidosComponent,
    AchadosperdidosCadastroComponent,
    ReservaComponent,
    UsuarioPendenteComponent,
    ModalReservaComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FullCalendarModule,
    HttpClientModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: "toast-top-right",
      preventDuplicates: true,
      closeButton: true,
    }),
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    {
      provide: LOCALE_ID,
      useValue: "pt",
    },
    {
      provide: ErrorHandler,
      useClass: AppErrorHandler,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },],
  bootstrap: [AppComponent]
})
export class AppModule { }
