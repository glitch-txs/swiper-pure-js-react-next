import Image from 'next/image'
import React, { use, useEffect, useRef, useState } from 'react'
import left from '../public/left.svg'
import right from '../public/right.svg'
import s from './Swiper.module.css'
import { data } from './data'

const Swiper = () => {

    const animationTime: number = 3000
    const transitionTime: string = '0.3s'

    //IMPORTANT. Number of Slides will generate the width of the slideContainer
    const numberOfSlides: number = data.length

    //The number by which the width of the slide will be divided by to decide where to move when dragging stops.
    const offsetPresition: number = 3

    const swiperRef = useRef<HTMLDivElement | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const intervalIDRef = useRef<NodeJS.Timer | null>(null)

    const [inView, setInView] = useState<boolean>(false)

    function getTranslateX(myElement: HTMLDivElement) {
        const style = window.getComputedStyle(myElement)
        const matrix = new WebKitCSSMatrix(style.transform)
        return matrix.m41
    }

    const handleNext = ()=>{
        if(swiperRef.current && swiperRef.current.children.length > 0){

            const firstChild = swiperRef.current.children[0]

            swiperRef.current.style.transition = `all ${transitionTime} ease-out`

            const childWidth = (swiperRef.current.children[0] as HTMLElement).offsetWidth

            swiperRef.current.style.transform = `translateX(-${childWidth}px)`

            const transition = ()=>{
                if(swiperRef.current){
                    swiperRef.current.style.transition = `none`
                    swiperRef.current.style.transform = `translateX(0px)`
                    swiperRef.current.appendChild(firstChild)

                    swiperRef.current.removeEventListener('transitionend', transition)
                }
            }

            swiperRef.current.addEventListener('transitionend', transition)

        }
    }
    
    const handlePrev = ()=>{
        if(swiperRef.current && swiperRef.current.children.length > 0){

            const lastChildIndex = swiperRef.current.children.length - 1
            
            const childWidth = (swiperRef.current.children[0] as HTMLElement).offsetWidth
            
            const lastChild = swiperRef.current.children[lastChildIndex]

            swiperRef.current.insertBefore(lastChild, swiperRef.current.firstChild)

            swiperRef.current.style.transition = 'none'
            swiperRef.current.style.transform = `translateX(-${childWidth}px)`

            setTimeout(()=>{
                if(swiperRef.current){
                    swiperRef.current.style.transition = `all ${transitionTime} ease-out`
                    swiperRef.current.style.transform = `translateX(0px)`
                }
            },0)

        }
    }

    //Trigger when component is in View
    useEffect(()=>{
        setInView(false)
        const observer = new IntersectionObserver((entries: IntersectionObserverEntry[])=>{
            if(entries[0].isIntersecting){
                setInView(true)
            } else {
                return
            }
        },{ threshold: 1, })

        if(containerRef.current)
        observer.observe(containerRef.current)

    },[])

    //Automatic Change - OPTIONAL
    useEffect(()=>{

        if(intervalIDRef.current){
            clearInterval(intervalIDRef.current)
        }

        if(inView){
            intervalIDRef.current = setInterval(()=>{
                handleNext()
            }, animationTime)
        
            //This will stop the animation if the window get blur to stop the animation when the user is not in the website. (Avoids Bugs).
            window.addEventListener('blur', ()=>{
                if(intervalIDRef.current)
                clearInterval(intervalIDRef.current)
            })
            window.addEventListener('focus', ()=>{
                if(intervalIDRef.current)
                clearInterval(intervalIDRef.current)
                intervalIDRef.current = setInterval(()=>{
                    handleNext()
                }, animationTime)
            })
        } else {
            if(intervalIDRef.current){
                clearInterval(intervalIDRef.current)
            }

            window.removeEventListener('blur', ()=>{
                if(intervalIDRef.current)
                clearInterval(intervalIDRef.current)
            })
            window.removeEventListener('focus', ()=>{
                if(intervalIDRef.current)
                clearInterval(intervalIDRef.current)
                intervalIDRef.current = setInterval(()=>{
                    handleNext()
                }, animationTime)
            })
        }


        return ()=> {
            if(intervalIDRef.current){
                clearInterval(intervalIDRef.current)
            }
            
            window.removeEventListener('blur', ()=>{
                if(intervalIDRef.current)
                clearInterval(intervalIDRef.current)
            })
            window.removeEventListener('focus', ()=>{
                if(intervalIDRef.current)
                clearInterval(intervalIDRef.current)
                intervalIDRef.current = setInterval(()=>{
                    handleNext()
                }, animationTime)
            })
        }

    },[inView])

    //Stop automation when hover - OPTIONAL
    useEffect(()=>{

        if(inView){
            if(window.innerWidth < 900){
                swiperRef.current?.addEventListener('touchstart', ()=>{
                    if(intervalIDRef.current)
                    clearInterval(intervalIDRef.current)
                })
                swiperRef.current?.addEventListener('touchend', ()=>{
                    intervalIDRef.current = setInterval(()=>{
                        handleNext()
                    }, animationTime)
                })
            } else {
                swiperRef.current?.addEventListener('mouseenter', ()=>{
                    if(intervalIDRef.current)
                    clearInterval(intervalIDRef.current)
                })
                swiperRef.current?.addEventListener('mouseleave', ()=>{
                    intervalIDRef.current = setInterval(()=>{
                        handleNext()
                    }, animationTime)
                })
            }
        } else {
            swiperRef.current?.removeEventListener('mouseenter', ()=>{
                if(intervalIDRef.current)
                clearInterval(intervalIDRef.current)
            })
            swiperRef.current?.removeEventListener('mouseleave', ()=>{
                intervalIDRef.current = setInterval(()=>{
                    handleNext()
                }, animationTime)
            })
            swiperRef.current?.removeEventListener('touchstart', ()=>{
                if(intervalIDRef.current)
                clearInterval(intervalIDRef.current)
            })
            swiperRef.current?.removeEventListener('touchend', ()=>{
                intervalIDRef.current = setInterval(()=>{
                    handleNext()
                }, animationTime)
            }) 
        }

    
        return ()=> {
            //Remove clear interval when hover
            swiperRef.current?.removeEventListener('mouseenter', ()=>{
                if(intervalIDRef.current)
                clearInterval(intervalIDRef.current)
            })
            swiperRef.current?.removeEventListener('mouseleave', ()=>{
                intervalIDRef.current = setInterval(()=>{
                    handleNext()
                }, animationTime)
            })
            swiperRef.current?.removeEventListener('touchstart', ()=>{
                if(intervalIDRef.current)
                clearInterval(intervalIDRef.current)
            })
            swiperRef.current?.removeEventListener('touchend', ()=>{
                intervalIDRef.current = setInterval(()=>{
                    handleNext()
                }, animationTime)
            })
        }
    },[inView])
    
    //Draggable
    useEffect(()=>{

        let posX1: number;
        let posX2: number;
        let totalDragged = 0;


        if(containerRef.current && inView){
            containerRef.current.addEventListener("touchstart", dragStart);
            containerRef.current.addEventListener("mousedown", dragStart);
        } else if (containerRef.current) {
            containerRef.current.removeEventListener("touchstart", dragStart)
            containerRef.current.removeEventListener("mousedown", dragStart)
        }

        function dragMove(e:any) {

            if(swiperRef.current){
            const childWidth = (swiperRef.current.children[0] as HTMLElement).offsetWidth

            if (e.type == "touchmove") {
                posX2 = posX1 - e.touches[0].clientX;
              } else {
                posX2 = posX1 - e.clientX;
              }
            
              if(totalDragged <= -1 * childWidth && totalDragged >= childWidth){
                return
              } else {
                swiperRef.current.style.transform = `translateX(${-posX2 - childWidth}px)`;
              }
              totalDragged += posX2
            }

          }
          
        function dragEnd() {
            if(swiperRef.current && containerRef.current){

                const translateOffset = getTranslateX(swiperRef.current)

                const childWidth = (swiperRef.current.children[0] as HTMLElement).offsetWidth
                if (translateOffset + childWidth < -1 * childWidth / offsetPresition && swiperRef.current && swiperRef.current.children.length > 0) {
                    //Go to Next slide

                    swiperRef.current.style.transform = `translateX(${-childWidth}px)`
            
                    const firstChild = swiperRef.current.children[0]
                    const secondtChild = swiperRef.current.children[1]
            
                    swiperRef.current.style.transition = `all ${transitionTime} ease-out`
            
                    swiperRef.current.style.transform = `translateX(${-childWidth * 2}px)`
            
                    const transition = ()=>{
                        if(swiperRef.current){
                            swiperRef.current.style.transition = `none`
                            swiperRef.current.style.transform = `translateX(0px)`
                            swiperRef.current.appendChild(firstChild)
                            swiperRef.current.appendChild(secondtChild)
            
                            swiperRef.current.removeEventListener('transitionend', transition)
                        }
                    }
            
                    swiperRef.current.addEventListener('transitionend', transition)

                } else if (translateOffset + childWidth > childWidth / offsetPresition) {
                    //Go to Prev slide
                    swiperRef.current.style.transition = `all ${transitionTime} ease-out`
                    swiperRef.current.style.transform = `translateX(0px)`
                } else {
                    //Stay in the current slide
                    const transition = ()=>{
                        if(swiperRef.current){
                            const firstChild = swiperRef.current.children[0]
                            swiperRef.current.style.transition = `none`
                            swiperRef.current.style.transform = `translateX(0px)`
                            swiperRef.current.appendChild(firstChild)
            
                            swiperRef.current.removeEventListener('transitionend', transition)
                        }
                    }
                    //transition won't trigger if distance is 0
                    if(translateOffset + childWidth == 0){
                        const firstChild = swiperRef.current.children[0]
                        swiperRef.current.style.transform = `translateX(0px)`
                        swiperRef.current.appendChild(firstChild)
                    } else {
                        swiperRef.current.style.transition = `all ${transitionTime} ease-out`
                        swiperRef.current.style.transform = `translateX(${-childWidth}px)`
                        swiperRef.current.addEventListener('transitionend', transition)
                    }
                }

                containerRef.current.removeEventListener("touchmove", dragMove)
                containerRef.current.removeEventListener("mousemove", dragMove)
                containerRef.current.removeEventListener("touchend", dragEnd)
                containerRef.current.removeEventListener("mouseup", dragEnd)
            }
        }

        function dragStart(e:any) {
            if(containerRef.current && swiperRef.current){
                swiperRef.current.style.transition = 'none'

                //Add prev image in case is dragedd to left
                const lastChildIndex = swiperRef.current.children.length - 1
            
                const childWidth = (swiperRef.current.children[0] as HTMLElement).offsetWidth
                
                const lastChild = swiperRef.current.children[lastChildIndex]
                swiperRef.current.insertBefore(lastChild, swiperRef.current.firstChild)

                swiperRef.current.style.transition = 'none'
                swiperRef.current.style.transform = `translateX(${-childWidth}px)`
                //

                if (e.type == "touchstart") {
                  posX1 = e.touches[0].clientX;

                  containerRef.current.addEventListener("touchmove", dragMove);
                  containerRef.current.addEventListener("touchend", dragEnd);
                } else {
                  posX1 = e.clientX;
              
                  containerRef.current.addEventListener("mouseup", dragEnd);
                  containerRef.current.addEventListener("mousemove", dragMove);
                }
            }            
        }

        return ()=>{
            if(containerRef.current){
                containerRef.current.removeEventListener("touchstart", dragStart)
                containerRef.current.removeEventListener("mousedown", dragStart)
                containerRef.current.removeEventListener("touchmove", dragMove)
                containerRef.current.removeEventListener("mousemove", dragMove)
                containerRef.current.removeEventListener("touchend", dragEnd)
                containerRef.current.removeEventListener("mouseup", dragEnd)
            }
        }

    },[inView])

  return (
    <>
        <div className={s.container} ref={containerRef} >

            <div className={s.slideContainer} ref={swiperRef} style={ { width: `calc(100% * ${numberOfSlides})` } } >

                {data?.map((item, index)=>(
                    <div key={index} className={s.slide}>

                        <Image src={item[0]} alt="" quality={100} />

                        <p className={s.textSlide} >
                            {item[1]}
                        </p>

                    </div>
                ))}

            </div>
        </div>

        <div className={s.controlsContainer} >
            <button onClick={handlePrev}>
                <Image src={left} alt="" />
            </button>
            <button onClick={handleNext}>
                <Image src={right} alt="" />
            </button>
        </div>
    </>

  )
}

export default Swiper