import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { eventNames } from 'process';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  name = 'Atanas Bekyarov';
  location = 'Sofia, Bulgaria';
  age = '29';
  bio = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus laborum soluta facere molestiae ipsam rem maxime id error, quaerat quis, praesentium, alias ratione quo. Quasi repellat minima in minus iste. ';
  socials = [];
  gallery = [];
  imgForModal = '';
  showImage($event){
    const target = $event.target || $event.srcElement || $event.currentTarget;
    const imgSrc = target.src;
    this.imgForModal = imgSrc;
  }

  constructor() { 
    this.gallery = [
      '../../../assets/images/Galery/1.jpg',
      '../../../assets/images/Galery/2.jpg',
      '../../../assets/images/Galery/3.jpg',
      '../../../assets/images/Galery/4.jpg',
      '../../../assets/images/Galery/5.jpg',
      '../../../assets/images/Galery/6.jpg',
      '../../../assets/images/Galery/7.jpg',
      '../../../assets/images/Galery/8.png',
      '../../../assets/images/Galery/9.jpg',
      '../../../assets/images/Galery/10.jpg',
      '../../../assets/images/Galery/11.jpg',
      '../../../assets/images/Galery/12.png',
    ],
    this.socials = [
      {
        name:'facebook',
        link: '#'
      },
      {
        name:'instagram',
        link: '#'
      },
      {
        name:'twitter',
        link: '#'
      },
      {
        name:'youtube',
        link: '#'
      },
      {
        name:'flickr',
        link: '#'
      },
    ]
  }

  ngOnInit(): void {
  }

}
