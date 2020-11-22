import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AchadosperdidosCadastroComponent } from './achadosperdidos/achadosperdidos-cadastro/achadosperdidos-cadastro.component';
import { AchadosperdidosComponent } from './achadosperdidos/achadosperdidos.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth/auth-guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { ReservaComponent } from './reserva/reserva.component';
import { UsuarioPendenteComponent } from './usuario-pendente/usuario-pendente.component';
import { UsuarioComponent } from './usuario/usuario.component';

const routes: Routes = [
  { path: "login", component: LoginComponent },
  {
    path: "", component: MainComponent, canActivate: [AuthGuard], children: [
      { path: "", redirectTo: "home", pathMatch: "full" },
      { path: "home", component: HomeComponent },
      { path: "usuario", component: UsuarioComponent },
      { path: "achadosperdidos", component: AchadosperdidosComponent },
      { path: "achadosperdidos-cadastrar", component: AchadosperdidosCadastroComponent },
      { path: "reserva", component: ReservaComponent },
      { path: "usuario-pendente", component: UsuarioPendenteComponent },]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
