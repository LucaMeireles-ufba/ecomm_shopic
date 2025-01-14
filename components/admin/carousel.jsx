'use client'
import useEmblaCarousel from 'embla-carousel-react'
import React, { useState, useEffect, useCallback } from 'react'
import '../ui/carousel.css'
import { Trash2Icon } from 'lucide-react';

export default function Carousel(props) {
	const OPTIONS = {}
	const SLIDE_COUNT = props.images.length
	const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

	return (
		<div>
			<EmblaCarousel
				slides={SLIDES}
				options={OPTIONS}
				images={props.images}
                handleDelete={props.handleDeleteImage}
			/>
		</div>
	)
}

const EmblaCarousel = (props) => {
	const { slides, options, images, handleDelete} = props
	const [selectedIndex, setSelectedIndex] = useState(0)
	const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options)
	const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
		containScroll: 'keepSnaps',
		dragFree: true,
	})

	const onThumbClick = useCallback(
		(index) => {
			if (!emblaMainApi || !emblaThumbsApi) return
			emblaMainApi.scrollTo(index)
		},
		[emblaMainApi, emblaThumbsApi]
	)

	const onSelect = useCallback(() => {
		if (!emblaMainApi || !emblaThumbsApi) return
		setSelectedIndex(emblaMainApi.selectedScrollSnap())
		emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap())
	}, [emblaMainApi, emblaThumbsApi, setSelectedIndex])

	useEffect(() => {
		if (!emblaMainApi) return
		onSelect()
		emblaMainApi.on('select', onSelect)
		emblaMainApi.on('reInit', onSelect)
	}, [emblaMainApi, onSelect])

	return (
		<div className="embla flex flex-row-reverse gap-6">
			<div className="embla__viewport " ref={emblaMainRef}>
				<div className="embla__container">
					{slides.map((index) => (
						<div className="embla__slide" key={index}>
							<img
								className="embla__slide__img"
								src={images[index]}
								alt="Your alt text"
							/>
						</div>
					))}
				</div>
			</div>

			<div className="embla-thumbs !mt-0">
				<div
					className="embla-thumbs__viewport overflow-y-auto"
					ref={emblaThumbsRef}
				>
					<div className="embla-thumbs__container !flex !flex-col w-36 gap-6">
						{slides.map((index) => (
                            <div key={index}>
                                <Thumb
                                    onClick={() => onThumbClick(index)}
                                    handleDelete={() => handleDelete(index)} 
                                    index={index}
                                    imgSrc={images[index]}
                                    key={index}
                                    />
                            </div>
                                ))}
					</div>
				</div>
			</div>
		</div>
	)
}

// Dentro do componente Thumb
const Thumb = (props) => {
    const { selected, imgSrc, index, onClick, handleDelete, ...rest } = props;
  
    return (
      <div
        className={'embla-thumbs__slide'.concat(
          selected ? ' embla-thumbs__slide--selected' : ''
        )}
        {...rest}
      >
        <button
          onClick={onClick}
          className="embla-thumbs__slide__button"
          type="button"
        >
          <img
            className="embla-thumbs__slide__img"
            src={imgSrc}
            alt="Your alt text"
          />
        </button>
        <button
          className="absolute bottom-0 right-0 p-1 bg-red-400"
          onClick={handleDelete}
        >
          <Trash2Icon/>
        </button>
      </div>
    );
  };
  