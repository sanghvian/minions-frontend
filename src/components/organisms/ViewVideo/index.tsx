import React, { useState, useEffect, useRef } from "react";
import "./ViewVideo.css";
import { AppDispatch, RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";
import apiService from "@utils/api/api-service";
import { Button, Spin, Input, Select, Card } from "antd";
import { SearchOutline } from "antd-mobile-icons";
import toast from "react-hot-toast";
import { setUserCurrentVideoTime } from "@redux/features/userSlice";
import { ActiveModalType, setIsModalOpen, setModalType } from "@redux/features/activeEntitiesSlice";
import YCLoader from "@components/atoms/YCLoader";
import DocumentChat from "../DocumentChat";

interface TranscriptItem {
  text: string;
  start: number;
  end: number;
  speaker?: string;
}

const ViewVideo = ({ videoId }: { videoId: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const documentTranscript = useSelector(
    (state: RootState) => state.document.activeDocument
  ).documentTranscript ?? ""
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [currentTextIndex, setCurrentTextIndex] = useState(-1);
  const [timestampedTranscript, setTimestampedTranscript] = useState<TranscriptItem[]>([]);
  const transcriptRefs = useRef<Array<React.RefObject<HTMLDivElement>>>([]);
  const [isManualScroll, setIsManualScroll] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState(useSelector((state: RootState) => state.document.activeDocument).videoId ?? "")
  const { token, usageCount } = useSelector(
    (state: RootState) => state.persisted.user.value
  );
  const [transcriptSearchOptions, setTranscriptSearchOptions] = useState<any[]>([]);
  const firefliesApiKey = useSelector((state: RootState) => state.persisted.user.value.firefliesApiKey ?? "")
  const currentVideoTime = useSelector((state: RootState) => state.persisted.user.value.currentVideoTime ?? 0)
  const scrollTimeoutRef = useRef<any>(null);

  const transcriptDivRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    setIsManualScroll(true); // Indicate manual scrolling
    if (scrollTimeoutRef.current !== null) {
      clearTimeout(scrollTimeoutRef.current); // Clear existing timeout
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsManualScroll(false); // Reset manual scrolling flag after a delay
    }, 5000);
  };

  const handleSeeking = () => {
  }

  const handleSeeked = () => {
  }

  useEffect(() => {
    if (currentVideoTime > 0 && timestampedTranscript.length > 0) {
      console.log("inside useeffect", currentVideoTime, timestampedTranscript)
      const currentTime = currentVideoTime as number;
      const textIndex = timestampedTranscript.findIndex(
        ({ start, end }) => currentTime >= start && currentTime <= end
      );
      // console.log(textIndex, timestampedTranscript[textIndex], currentVideoTime)
      if (timestampedTranscript[textIndex]) {
        handleClickTranscriptItem(timestampedTranscript[textIndex].start, textIndex)
      } else {
        handleClickTranscriptItem(timestampedTranscript[0].start, textIndex);
      }
    }
  }, [currentVideoTime])

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener("seeking", handleSeeking);
    video.addEventListener("seeked", handleSeeked);

    return () => {
      video.removeEventListener("seeking", () => handleSeeking);
      video.removeEventListener("seeked", handleSeeked);
      if (scrollTimeoutRef.current !== null) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [timestampedTranscript]);

  const scrollToActiveItem = (index?: number) => {
    const targetIndex = index !== undefined ? index : currentTextIndex;
    const activeElement = transcriptRefs.current[targetIndex]?.current;
    if (activeElement) {
      activeElement.scrollIntoView({ behavior: "smooth", block: "center" });
      setIsManualScroll(false);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      const method = isPlaying ? "pause" : "play";
      videoRef.current[method]();
      setIsPlaying(!isPlaying);
      scrollToActiveItem()
    }
  };

  const activeUserEmail = useSelector(
    (state: RootState) => state.persisted.user.value.activeUserEmail
  );
  const dispatch = useDispatch()
  
  useEffect(() => {

    const fetchTranscript = async () => {
      if (activeVideoId === "") return;
      try {
        let transcriptData: TranscriptItem[] = [];
        const video = await apiService.getVideo(activeVideoId, token);
        const url = new URL(video.videoUrl);

        let response: {
          timestampedTranscript: TranscriptItem[];
          url: string;
        } = { timestampedTranscript: [], url: "" };
        console.log(url);
        if (url.hostname === "app.fireflies.ai") {
          const firefliesTranscriptId = video.videoUrl.split("::")[1];
          response = await apiService.fetchFirefliesTimestampedTranscript({
            firefliesApiKey,
            firefliesTranscriptId,
            videoId: activeVideoId,
          });
        } else if (url.hostname === "docs.google.com") {
          setActiveVideoId("")
        } else {
          response = await apiService.getVideoTranscriptWithTimestamp(
            activeVideoId,
            token
          );
        }

        transcriptData = response.timestampedTranscript;
        setVideoUrl(response.url);
        setTimestampedTranscript(transcriptData);
        setTranscriptSearchOptions(
          transcriptData.map((item: any, n: number) => ({
            value: `${n}`,
            label: item.text,
          }))
        );
        transcriptRefs.current = transcriptData.map(() =>
          React.createRef<HTMLDivElement>()
        );

        //? This range between start and end won't work as we might have a currentTime whose value is between the start and end of two different transcript items
        // const textIndex = transcriptData.findIndex(
        //   ({ start, end }) => currentTime >= start && currentTime <= end
        // );

        // We pick the index right before where the start is just greater than currentTime so we 
        const textIndex = currentVideoTime > 0 ? transcriptData.findIndex(
          ({ start }) => start > currentVideoTime
        ) - 1 : 0
        handleClickTranscriptItem(transcriptData[textIndex].start, textIndex);
      } catch (err: any) {
        // toast.error(`Error fetching transcript: ${err.message}`);
      }
    };

    fetchTranscript();

    return () => {
      if (scrollTimeoutRef.current !== null) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [activeVideoId, token]);  // Assuming `apiService`, `firefliesApiKey` are stable or correctly memoized elsewhere

  useEffect(() => {
    return () => {
      dispatch(setUserCurrentVideoTime(0))
    }
  }, [currentVideoTime])

  const getOrCreateRef = (id: number) => {
    if (!transcriptRefs.current[id]) {
      transcriptRefs.current[id] = React.createRef<HTMLDivElement>();
    }
    return transcriptRefs.current[id];
  };

  const handleClickTranscriptItem = (startTime: number, index: number) => {
    // console.log('handleClickTranscriptItem', videoRef, startTime, index)
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
      videoRef.current.currentTime = startTime;
      setIsManualScroll(false);
      setCurrentTextIndex(index);
      scrollToActiveItem(index);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
      videoRef.current.play();
      setIsPlaying(true);
    }
  };


  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // console.log(timestampedTranscript)
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => {
      const currentTime = videoRef.current?.currentTime as number;

      const textIndex = timestampedTranscript.findIndex(
        ({ start, end }) => currentTime >= start && currentTime <= end
      );
      setCurrentTextIndex(textIndex);
      if (!isManualScroll && transcriptRefs.current[textIndex]?.current) {
        scrollToActiveItem();
      }
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [timestampedTranscript, isManualScroll, currentTextIndex]);

  const onTranscriptSearch = (value: string) => {
    if (value === "") {
      setTranscriptSearchOptions(timestampedTranscript.map((item, n) => ({ value: `${n}`, label: item.text })));
      return
    }
    const searchResult = timestampedTranscript.filter((item) =>
      item.text.toLowerCase().includes(value.toLowerCase())
    );
    const searchResultOptions = searchResult.map((item, n) => {
      const optionValue = timestampedTranscript.findIndex(
        (element) => element.text === item.text
      );
      const searchIndex = item.text.toLowerCase().indexOf(value.toLowerCase());
      const optionLabel =
        "..." +
        item.text.substring(
          Math.max(searchIndex - 10, 0),
          Math.min(searchIndex + value.length + 10, item.text.length)
        ) +
        "...";
      return { value: optionValue, label: optionLabel };
    });
    setTranscriptSearchOptions(searchResultOptions);
  }

  const onTranscriptSelect = (value: any) => {
    handleClickTranscriptItem(timestampedTranscript[value].start, value)
  }
  if (activeVideoId === "") {
    if (documentTranscript === "")
      return (
        <div>
          <p>Video not found</p>
        </div>
      );
    else {
      return (
        <div>
          <h3>Transcript</h3>
          <Card
            style={{
              height: "400px",
              overflowY: "scroll",
              width: "70%",
              marginLeft: "15%",
            }}
          >
            <p dangerouslySetInnerHTML={{ __html: documentTranscript }} />
          </Card>
        </div>
      );
    }
  } else if (timestampedTranscript.length > 0)
    return (
      <div className="video-transcript-div">
        <div className="video-div">
          <video ref={videoRef} className="video-player" controls>
            {videoUrl && <source src={videoUrl} type="video/mp4" />}
            Your browser does not support the video tag.
          </video>
          <div className="buttons-div">
            <Button
              type="primary"
              className="video-button"
              onClick={togglePlay}
            >
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button
              className="video-button"
              onClick={() => scrollToActiveItem()}
            >
              Go to Current Snippet
            </Button>
          </div>
        </div>
        <div
          style={{
            marginTop: "1rem",
          }}
        >
          <div className="transcript-heading">Transcript</div>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Search transcript"
            onSearch={onTranscriptSearch}
            onChange={(e) => onTranscriptSelect(e)}
            suffixIcon={<SearchOutline />}
            options={transcriptSearchOptions}
            filterOption={false}
            // filterOption={(input, option) =>
            //   option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            //}
          />
          <div
            className="transcript-div"
            ref={transcriptDivRef}
            onScroll={handleScroll}
          >
            {timestampedTranscript.map((item, index) => (
              <div
                key={index}
                ref={getOrCreateRef(index)}
                className={
                  index === currentTextIndex
                    ? "highlighted-text-element"
                    : "text-element"
                }
                onClick={() => handleClickTranscriptItem(item.start, index)}
              >
                <div className="speaker-name">{item.speaker}</div>
                <div className="transcript-text-div">{item.text}</div>
                <div className="text-element-timestamp">
                  {Math.floor(item.start / 60) +
                    ":" +
                    ("0" + Math.floor(item.start % 60)).slice(-2)}{" "}
                  -{" "}
                  {Math.floor(item.end / 60) +
                    ":" +
                    ("0" + Math.floor(item.end % 60)).slice(-2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  else return (
    <div>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <YCLoader />{" "}
        <p>Takes about 2-3mins to set up the transcript, the 1st time.✨</p>{" "}
      </div>
    </div>
  );
};

export default ViewVideo;
