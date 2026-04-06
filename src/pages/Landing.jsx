import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import logo from '../assets/logo.png'

// ✅ LOCAL IMAGES
import heroImg from '../assets/images/hero.jpg'
import walletImg from '../assets/images/wallet.jpg'
import hospitalImg from '../assets/images/hospital.jpg'
import claimsImg from '../assets/images/claims.jpg'
import secureImg from '../assets/images/secure.jpg'
import trustedImg from '../assets/images/trusted.jpg'
import mobileImg from '../assets/images/mobile.jpg'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } }
}

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white text-gray-900 text-base md:text-lg">

      {/* NAV */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="flex items-center justify-between px-6 h-18">

          <div className="flex items-center gap-3">
            <img src={logo} className="w-8 h-8 object-contain" />
            <span className="font-extrabold text-blue-600 text-2xl">PAYG</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/signin" className="text-base font-medium hover:text-blue-600">
              Sign In
            </Link>

            <button
              onClick={() => navigate('/auth')}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700"
            >
              Get Started
            </button>
          </div>

        </div>
      </header>

      <main className="pt-24">

        {/* HERO */}
        <section className="px-6 py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={stagger}
              className="text-center md:text-left"
            >

              <motion.span
                variants={fadeUp}
                className="inline-block bg-white text-blue-600 px-5 py-1.5 rounded-full text-sm font-bold mb-6 shadow-sm"
              >
                🌟 Simplifying Health Insurance Access
              </motion.span>

              <motion.h1
                variants={fadeUp}
                className="text-5xl md:text-6xl font-black leading-tight mb-6"
              >
                Your Health, Your Coverage,
                <span className="text-blue-600"> Simplified</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-gray-600 text-xl mb-8 max-w-md mx-auto md:mx-0"
              >
                PayG enables individuals to access insurance through safe, reliable,
                and affordable mobile-based payment solutions.
              </motion.p>

              <motion.div variants={fadeUp} className="flex gap-4 justify-center md:justify-start">
                <button
                  onClick={() => navigate('/auth')}
                  className="bg-blue-600 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-blue-700"
                >
                  Get Started
                </button>

                <button
                  onClick={() => navigate('/signin')}
                  className="border border-gray-300 px-7 py-3.5 rounded-xl font-semibold hover:border-blue-600"
                >
                  Sign In
                </button>
              </motion.div>

            </motion.div>

            {/* HERO IMAGE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img
                src={heroImg}
                className="rounded-3xl shadow-2xl h-[460px] w-full object-cover"
              />
            </motion.div>

          </div>
        </section>

        {/* FEATURES */}
        <section className="px-6 py-28 bg-white">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8"
          >

            {[
              { img: walletImg, title: "Smart Wallet", desc: "Fund anytime, stay covered." },
              { img: hospitalImg, title: "Hospital Access", desc: "Use trusted hospitals nationwide." },
              { img: claimsImg, title: "Fast Claims", desc: "Submit and track easily." }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
              >
                <img src={item.img} className="h-52 w-full object-cover" />
                <div className="p-6">
                  <h3 className="font-bold text-xl">{item.title}</h3>
                  <p className="text-gray-500 text-base">{item.desc}</p>
                </div>
              </motion.div>
            ))}

          </motion.div>
        </section>

        {/* TRUST */}
        <section className="px-6 py-24 bg-gray-50">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8"
          >

            {[
              { img: secureImg, title: "Secure Payments" },
              { img: trustedImg, title: "Trusted Providers" },
              { img: mobileImg, title: "Mobile First" }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <img src={item.img} className="h-44 w-full object-cover" />
                <div className="p-6">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-gray-500 text-base">
                    Built for secure and accessible healthcare coverage.
                  </p>
                </div>
              </motion.div>
            ))}

          </motion.div>
        </section>

        {/* CTA */}
        <section className="px-6 py-28">
          <div className="max-w-5xl mx-auto bg-blue-600 text-white text-center p-16 rounded-3xl shadow-xl">

            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Ready to protect your health?
            </h2>

            <button
              onClick={() => navigate('/auth')}
              className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg"
            >
              Join PAYG
            </button>

          </div>
        </section>

      </main>
    </div>
  )
}