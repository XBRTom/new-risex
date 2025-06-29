import { Button } from "@/components/ui/button"

const JoinUs = () => {
  return (
    <section className="py-40 px-4 bg-gray-800 mb-0">
        <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Revolutionize Your Liquidity?</h2>
            <p className="text-xl text-white mb-10 max-w-2xl mx-auto">
            Join Liquid today and take control of your DeFi investments.
            </p>
            <Button 
                size="xl" 
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
            >
                Start Now !
            </Button>
        </div>
    </section>
  )
}

export default JoinUs;