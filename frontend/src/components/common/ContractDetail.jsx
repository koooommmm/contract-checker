import { useNavigate } from 'react-router-dom';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebaseConfig';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

import { pdfjs, Document, Page } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { getContract } from '../../models/contracts';

import { IoWarning } from 'react-icons/io5';

// pdfjsを使うための処理
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
  ).toString();

// non-latin charactersを取り扱うための処理
const pdfjsOptions = {
    cMapUrl: '/cmaps/',
};

const ContractDetail = () => {
    const [user, loading, error] = useAuthState(auth);

    // navigate関数
    const navigate = useNavigate();

    // URLパラメータの取得
    const {id} = useParams();

    // 非同期に取得する値をstateに入れている
    const [alerts, setAlerts] = useState([]);
    const [url, setUrl] = useState(null);

    useEffect(() => {
        async function fetchContract() {
            const fetchedContract = await getContract(id);
            setAlerts(fetchedContract.alerts);

            // StorageからPDFの取得
            // gsutil cors set cors.json gs://contract-checker-694c2.appspot.com/
            const storage = getStorage();
            // TODO
            // 「/userId/ファイル名」の構成にしておくか
            // userIdの一致を条件とした認証があるべき
            const pathRef = ref(storage, 'pdf/' + fetchedContract.pdf);
            const url = await getDownloadURL(pathRef);
            setUrl(url);
        }
        fetchContract();
    }, [id]);

    // PDFのページ数を設定
    const [numPages, setNumPages] = useState();
    const [pageNumber, setPageNumber] = useState(1);
  
    function onDocumentLoadSuccess({ numPages }) {
      setNumPages(numPages);
    }

    function incrementPage() {
        if (pageNumber != numPages) {
            setPageNumber(pageNumber + 1);
        } 
    }

    function decrementPage() {
        if (pageNumber != 1) {
            setPageNumber(pageNumber - 1);
        } 
    }


    if (loading) {
        return <div>ローディング</div>;
    }

    if (error) {
    return <div>Error: {error.message}</div>;
    }

    return user && (
        <div className='container mx-auto'>
            <div className='float-none w-full px-6 py-2 bg-red-100 font-bold text-xl'>
                契約書詳細
            </div>
            <div className='flex flex-row'>
                {/* PDF出力部 */}
                <div className='flow-left basis-3/5'>
                    <Document file={url} onLoadSuccess={onDocumentLoadSuccess} options={pdfjsOptions}>
                        <Page  pageNumber={pageNumber}/>
                    </Document>
                    {/* TODO ページ移動時に画面が強制的に一番上にスクロールされるのを防ぐ */}
                    <div className='flex justify-center'>
                        <button onClick={() => decrementPage()}>←</button>
                        {pageNumber} / {numPages}
                        <button onClick={() => incrementPage()}>→</button>
                    </div>
                </div>
                
                {/* アラート一覧 */}
                <div className='flow-right basis-1/3 m-6'>
                    <div className='flex flex-row items-end'>
                        <IoWarning size={30} color={'#d82'}/>
                        <span className='px-2 font-bold text-xl'>{alerts.length}</span>
                        件のアラート
                    </div>
                    <div>
                        {/* アラート詳細 */}
                        {alerts.map((item) => {
                            return <div key={item.article}>
                                <div className='font-bold'>
                                    {item.article}
                                </div>
                                <div className='p-2 bg-red-100 rounded-md'>
                                    {item.content}
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
            <div className='flex justify-center'>
                <button 
                    className='w-32 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 disabled:bg-red-300 flex justify-center'
                    onClick={() => navigate('/')}
                >
                    戻る
                </button>
            </div>
        </div>
    );
}

export default ContractDetail;