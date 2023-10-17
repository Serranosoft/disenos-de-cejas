import LottieView from 'lottie-react-native';

export default function Loading() {
    return <LottieView style={{ position: "absolute" }} source={require("../../assets/lottie/loading-animation.json")} loop={true} autoPlay={true} />
}