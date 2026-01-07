import { Suspense } from 'react';
import VerifyOtp from '../../components/VerifyOtp';
import Loading from '@/src/components/Loading';

const VerifyPage = () => {
 
  return (
    <Suspense fallback={<Loading />}>
     <VerifyOtp />
    </Suspense>
  )
}

export default VerifyPage
