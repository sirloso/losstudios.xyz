import React from 'react';
import { Fade, Slide } from 'react-slideshow-image';
import { SlideShowProps } from '../Logic/types';


export const SlideShow = (props:SlideShowProps) => {
	return( 
		<div className="slideShow animate__animated animate__fadeIn" key={props.id} id={props.id}>
			<Fade className="slideShow" easing="ease">
				{
					props.images.map((img: string, idx) => {
						return (
							<div className="each-slide" key={idx}>
								<div id="bg" style={{ 'backgroundImage': `url(${img})` }}>
								</div>
							</div>
						)
					})
				}
			</Fade>
		</div>
	)
};

export const SlideShow2 = (images: Array<string>,id: string) => {
	return[ 
		<div className="slideShow" key={id} id={id}>
			<Slide easing="ease">
				{
					images.map((img: string, idx) => {
						return (
							<div className="each-slide" key={idx}>
								<div style={{ 'backgroundImage': `url(${img})` }}>
									<span>Slide 1</span>
								</div>
							</div>
						)
					})
				}
			</Slide>
		</div>
		,	
		id
	]
};