import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { SongService } from './song.service';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    LeaderboardComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: 'search', component: SearchComponent },
      { path: 'leaderboard/:metric', component: LeaderboardComponent },
      { path: 'leaderboard', redirectTo: 'leaderboard/unique_words', pathMatch: 'full' },
      { path: '', redirectTo: 'leaderboard/unique_words', pathMatch: 'full' },
    ]),
  ],
  providers: [SongService],
  bootstrap: [AppComponent]
})
export class AppModule {}
