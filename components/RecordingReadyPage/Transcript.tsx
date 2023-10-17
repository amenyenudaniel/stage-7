/* eslint-disable react/no-unescaped-entities */
import Image from 'next/image'
import React, { useRef, useEffect, useState } from 'react';

import { TranscriptProps } from '@/types/transcript'
import { TranscriptData } from '@/types/transcript-data'


const Transcript: React.FC<TranscriptProps> = ({ videoID, currentVideoTime, currentVidDuration }) => {
  const [transcriptionData, setTranscriptionData] = useState<{
    transcript: string;
    words: TranscriptData[];
  }>({ transcript: '', words: [] });
  const transcriptContainerRef = useRef<HTMLDivElement>(null); // Ref for the transcript container


  // Fetch transcript data
  // useEffect(() => {
  //   const fetchTranscription = async () => {
  //     try {
  //       // const response = await fetch(`https://www.cofucan.tech/srce/api/transcript/${videoID}.json`);
  //       const response = await fetch(`https://fakejson.com`);
  //       const data = await response.json();
  //       console.log(data.transcript)
  //       setTranscriptionData(data);
  //     } catch (error) {
  //       console.error('Error fetching transcript:', error);
  //     }
  //   };
  //   if (videoID) {
  //     fetchTranscription();
  //   }
  // }, [videoID]);
  // Fetch transcript data
  useEffect(() => {
    const fetchTranscription = async () => {
      console.log("this is in transcript fetch");
      try {
        const response = await fetch(`https://www.cofucan.tech/srce/api/transcript/${videoID}.json`);
        // const response = await fetch("https://random-words-api.vercel.app/word");
        console.log("response at 40T:", response);
        const data = await response.json();
        console.log(data.word)
        setTranscriptionData(data);
      } catch (error) {
        console.error('Error fetching transcript:', error);
      }
    };
    if (videoID) {
      fetchTranscription();
    }
  }, [videoID]);

  // to format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`
  }

  //to show current word
  useEffect(() => {
    const transcriptContainer = transcriptContainerRef.current as HTMLElement;
    // transcriptContainer.style.backgroundColor = 'blue';
    if (transcriptContainer) {
      const currentTranscript = transcriptionData.words?.find((item) => item.start <= currentVideoTime && item.end >= currentVideoTime);
      if (currentTranscript) {
        const transcriptElement = document.getElementById(`transcript-${currentTranscript.start}`) as HTMLElement;
        transcriptElement.style.color = '#000';
        if (transcriptElement) {
          transcriptContainer.scrollTo({
            top: transcriptElement.offsetTop - transcriptContainer.offsetTop - 50,
            behavior: 'smooth',
          });
        }
      }
    }
  }, [currentVideoTime, transcriptionData]);

  useEffect(() => {
    // Making sure videoDuration is greater than 0 to avoid division by zero
    if (currentVidDuration > 0 && currentVideoTime > 0) {
      // console.log("curentVidDur:", currentVidDuration, " & currVidTime:", currentVideoTime);
      // Calculate the progress percentage
      const progress = (currentVideoTime / currentVidDuration) * 100;
      console.log("Progresses:", progress);
      // Scroll your transcript container here
      const transcriptContainer = document.getElementById('org-transcipt-container');
      if (transcriptContainer) {
        transcriptContainer.scrollTop = (progress / 100) * transcriptContainer.scrollHeight * 0.9;  //adjust the scroll speed
      }
    }
  }, [currentVidDuration, currentVideoTime]);


  // set interval to show the transcript in different div with interval of 'intervalDuration'
  const intervalDuration = 6; // 6 seconds
  const duration = currentVidDuration;
  const intervals = [];
  for (let i = 0; i < duration; i += intervalDuration) {
    intervals.push(i);
  }

  return (
    <div className='w-full'>
      <h5 className="text-h6 ss:text-h5 text-black font-Sora font-[600] mb-4">
        Transcript 
      </h5>
      <div className="mb-[40px] gap-[80px] border-[1px] px-[8px] w-[170px] h-[35px] items-center rounded-[4px] hidden ss:flex">
        <h6 className="text-h6 text-gray-300">English</h6>
        <Image
          src="/assets/video-repo/arrow-down.svg"
          alt="arrow down"
          width="16"
          height="16"
        />
      </div>

      <div className="w-full h-auto relative">
        <div className="font-Inter w-full h-[164px] border-[1px] rounded-[12px]  ss:border-none p-3 ss:h-[255px]   gap-4 relative ">

          {/* if we are getting duration infinity err then uncomment this piece of code and comment the next section of code also the above code that is used to set intervals in intervals[] */}
          {/* transcript to show as a single piece of text -start */}
          {/* <div className='p-2 overflow-y-scroll custom-scrollbar flex gap-4 h-full pt-10 ' id='org-transcipt-container'>
          <h5 className="font-[400] w-1/12  font-Work-Sans text-[14px] xs:text-[16px] text-black  py-2 mr-3">
              {formatTime(currentVideoTime)}
              </h5>
            <div id="transcript-container" ref={transcriptContainerRef} className="custom-scrollbar  overflow-x-auto flex flex-wrap" >
              {transcriptionData.words?.map((item, index) => {
                return (
                  <p id={`transcript-${item.start}`} key={index} className="mr-1 text-gray-400">
                    <strong>{item.punctuated_word}</strong>
                  </p>
                );
              })}

            </div> */}
          {/* transcript to show as a single piece of text -end */}



          {/* this code to work - we need video duration, if duration is infinity then this piece of code will return memory overflow err as duration is infinity the arr will give memory overload */}
          {/* transcript to display as it is in design -start */}
          <div className='p-2 overflow-y-scroll custom-scrollbar gap-4 h-full pt-10 ' id='org-transcipt-container'>
            {intervals.map((startTime, index) => {
              const endTime = startTime + intervalDuration;
              const wordsInInterval = transcriptionData.words.filter(item => item.start >= startTime && item.start < endTime);

              return (
                <div key={index} className='flex'>
                  <h5 className="font-[400] w-1/12  font-Work-Sans text-[14px] xs:text-[16px] text-black  py-2 mr-3 xs:w-2/12">
                    {formatTime(startTime)}
                  </h5>
                  <div className="w-11/12 flex flex-wrap py-2 xs:w-10/12">
                    {wordsInInterval.map((item, wordIndex) => (
                      //mapping with key 'wordIndex'
                      <div key={wordIndex} id="transcript-container" ref={transcriptContainerRef} className="custom-scrollbar  overflow-x-auto flex flex-wrap" >
                        <p id={`transcript-${item.start}`} className="mr-1 text-gray-400">
                          <strong>{item.punctuated_word}</strong>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {/* transcript to display as it is in design -end */}
            {/* this section ends here till here  */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Transcript
