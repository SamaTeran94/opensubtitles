import { useEffect, useState } from 'react';
import axios from 'axios';

const Opensubs = () => {
    const [subtitles, setSubtitles] = useState([]);
    const [filterSubtitles, setFilterSubtitles] = useState('');
    const [imdbId, setImdbId] = useState('');
    const [year, setYear] = useState('');
    const [language, setLanguage] = useState('');
    const [filteredSubtitlesImdb, setFilteredSubtitlesImdb] = useState([]);
    const [latestSubtitles, setLatestSubtitles] = useState([]);

    useEffect(() => {
        fetchLatestSubtitles();
    }, []);

    useEffect(() => {
        fetchData(filterSubtitles, language, year, imdbId);
    }, [filterSubtitles, language, year, imdbId]);

    const fetchLatestSubtitles = async () => {
        const options = {
            method: 'GET',
            url: 'http://localhost:3000/api/v1/discover/most_downloaded',
            params: { languages: 'en,' },
            headers: {
                'Api-Key': 'j0HWhfDIHxcE0qcPCUpnOIZUh4D1sU61'
            }
        };

        try {
            const { data } = await axios.request(options);
            console.log(data);
            setLatestSubtitles(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchData = async (query, languages, year, imdb_id) => {
        const options = {
            method: 'GET',
            url: 'http://localhost:3000/api/v1/subtitles',
            params: { query: query, imdb_id: imdb_id, year: year, languages: languages },
            headers: { 'Api-Key': 'j0HWhfDIHxcE0qcPCUpnOIZUh4D1sU61' }
        };

        try {
            const response = await axios.request(options);
            const { data } = response;

            setSubtitles(data.data);
            setFilteredSubtitlesImdb(data.data);

            console.log(data);
        } catch (error) {
            // Handle errors
            //console.error(error);
        }
    };

    const downloadSubtitle = async (fileID, fileName) => {
        const options = {
            method: 'POST',
            url: 'https://api.opensubtitles.com/api/v1/download',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Api-Key': 'j0HWhfDIHxcE0qcPCUpnOIZUh4D1sU61'
            },
            data: { file_id: fileID },
            responseType: 'blob'
        };

        try {
            const response = await axios.request(options);
            console.log(response);

            const blob = new Blob([response.data], { type: 'application/octet-stream' });

            const fileNameWithExtension = `${fileName}.srt`;

            const url = URL.createObjectURL(blob);

            const linkElement = document.createElement('a');
            linkElement.href = url;
            linkElement.download = fileNameWithExtension;
            linkElement.click();

            URL.revokeObjectURL(url);
        } catch (error) {
            if (error.response || error.response.status === 429) {
                const retryDelay = calculateRetryDelay();
                console.log(`Rate limit exceeded. Retrying after ${retryDelay} milliseconds.`);
                setTimeout(downloadSubtitle, retryDelay);
            } else {
                console.error(error);
            }
        }
    };

    const calculateRetryDelay = () => {
        const baseDelay = 1000; // 1 second
        const maxDelay = 10000; // 10 seconds
        const retryCount = subtitles.length;

        const delay = Math.min(baseDelay * Math.pow(2, retryCount), maxDelay);
        return delay;
    };

    return (
        <>
            <div>
                <input
                    required
                    value={filterSubtitles}
                    className="border-2 border-black"
                    type="text"
                    placeholder="Title"
                    onChange={(e) => setFilterSubtitles(e.target.value)}
                />
                <input
                    required
                    value={language}
                    className="border-2 border-black"
                    type="text"
                    placeholder="Language Code"
                    onChange={(e) => setLanguage(e.target.value)}
                />
                <input
                    required
                    value={year}
                    className="border-2 border-black"
                    type="text"
                    placeholder="Year"
                    onChange={(e) => setYear(e.target.value)}
                />
                <input
                    value={imdbId}
                    className="border-2 border-black"
                    type="text"
                    placeholder="IMDb ID"
                    onChange={(e) => setImdbId(e.target.value)}
                />
            </div>
            <div>
                {((filterSubtitles && filteredSubtitlesImdb.length > 0) ||
                    (imdbId && filteredSubtitlesImdb.length > 0) ||
                    (year && filteredSubtitlesImdb.length > 0))
                    ? filteredSubtitlesImdb.slice(0, 30).map((subs) => (
                        <div key={subs.id}>
                            <h1>{subs.attributes.feature_details.title} ({subs.attributes.feature_details.year})</h1>
                            <h1>Language: {subs.attributes.language.toUpperCase()}</h1>
                            <h1>IMDB ID: {subs.attributes.feature_details.imdb_id}</h1>
                            <h1 className="font-bold">{subs.attributes.release}</h1>
                            {subs.attributes.related_links &&
                                subs.attributes.related_links.map((link) => (
                                    <img
                                        width={100}
                                        height={100}
                                        src={link.img_url}
                                        alt="Related Link"
                                        key={link.img_url}
                                    />
                                ))}
                            {subs.attributes.files &&
                                subs.attributes.files.map((file) => (
                                    <button
                                        key={file.file_id}
                                        onClick={() => downloadSubtitle(file.file_id, file.file_name)}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Download Subtitle
                                    </button>
                                ))}
                        </div>
                    ))
                    : latestSubtitles.slice(0, 10).map((subs) => (
                        <div key={subs.id}>
                            <h1>{subs.attributes.feature_details.title}</h1>
                            <h1>Language: {subs.attributes.language.toUpperCase()}</h1>
                            <h1 className="font-bold">{subs.attributes.release}</h1>
                            {subs.attributes.related_links &&
                                subs.attributes.related_links.map((link) => (
                                    <img
                                        width={100}
                                        height={100}
                                        src={link.img_url}
                                        alt="Related Link"
                                        key={link.img_url}
                                    />
                                ))}
                            {subs.attributes.files &&
                                subs.attributes.files.map((file) => (
                                    <button
                                        key={file.file_id}
                                        onClick={() => downloadSubtitle(file.file_id, file.file_name)}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Download Subtitle
                                    </button>
                                ))}
                        </div>
                    ))
                }
            </div>
        </>
    );
};

export default Opensubs;
