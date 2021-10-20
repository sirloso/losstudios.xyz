import React, { useRef } from 'react';
import { Fade, Slide } from 'react-slideshow-image';
import { SlideShowProps } from '../Logic/types';


export function SlideShow (images: Array<string>, id: string ){
	const slideRef = React.createRef()

	const slideOpts = {
		canSwipe: true,
		autoPlay: true,
		prevArrow: PrevArrow(slideRef),
		nextArrow: NextArrow(slideRef)
	}

	return(
		<div className="slideShow" key={id} id={id}>
			<Fade ref={slideRef} {...slideOpts} className="slideShow" easing="ease">
			{
					images.map((img: string, idx) => {
						return (
							<div className="each-slide" key={idx}>
								<img id="bg" src={img} style={{ 'backgroundImage': `url(${img})` }}/>
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

const PrevArrow = (ref: React.MutableRefObject<any>)=>{
	const prev = ref.current ? ()=>{alert("HELLO");ref.current.goBack();} : ()=>{}
	return(
		<div className="arrow" id="prevArrow" onClick={prev} onTouchEnd={prev}>
			<div className="hover smallArrow">
				prev	
			</div>
		</div>
	)
}

const NextArrow = (ref: React.MutableRefObject<any>)=>{
	const next = ref.current ? ref.current.goNext() : ()=>{}
	return(
		<div className="arrow" id="nextArrow" onClick={next} onTouchEnd={next}>
			<div className="hover smallArrow">
				next
			</div>
		</div>
	)
}