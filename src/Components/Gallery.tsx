import React from 'react';
import { Slide } from 'react-slideshow-image';


export const SlideShow = (images: Array<string>,id: string) => {
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