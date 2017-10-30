import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
	title = 'Lyric Analysis';
	totalWordCount = 0;
	uniqueWordCount = 0;
	uniqueRatio = '';

	analyzeText (text:string) {
		let textArray:string[];
		textArray = text.trim().split(/[\s,\r\n]+/);

		let uniqueTextArray = [...new Set(textArray)];

		this.totalWordCount = text.split(/[\s,\r\n]+/).length;
		this.uniqueWordCount = uniqueTextArray.length;
		this.uniqueRatio = ((this.uniqueWordCount/this.totalWordCount)*100).toFixed(2);
	}
}
