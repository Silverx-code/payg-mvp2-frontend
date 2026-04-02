import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import logo from '../assets/logo.png'

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
    <div className="min-h-screen bg-white text-ink">

      {/* NAV */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-[#dce2f7]">
        <div className="flex items-center justify-between px-6 h-16">

          <div className="flex items-center gap-3">
            <img src={logo} className="w-7 h-7 object-contain" />
            <span className="font-extrabold text-[#004ac6] text-xl">PAYG</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/plans" className="text-sm font-medium hover:text-[#004ac6]">Plans</Link>
            <button
              onClick={() => navigate('/auth')}
              className="bg-[#004ac6] text-white px-4 py-2 rounded-xl font-bold"
            >
              Get Started
            </button>
          </div>

        </div>
      </header>

      <main className="pt-20">

        {/* HERO */}
        <section className="px-6 py-20 bg-[#f1f3ff] overflow-hidden">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

            {/* TEXT */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={stagger}
              className="text-center md:text-left"
            >

              <motion.span
                variants={fadeUp}
                className="inline-block bg-white text-[#004ac6] px-4 py-1 rounded-full text-xs font-bold mb-6"
              >
                Insurance Redefined
              </motion.span>

              <motion.h1
                variants={fadeUp}
                className="text-5xl md:text-6xl font-black leading-tight mb-6"
              >
                Health insurance that fits your{" "}
                <span className="text-[#004ac6]">daily life</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-gray-600 text-lg mb-8 max-w-md mx-auto md:mx-0"
              >
                Pay small, stay covered — anytime, anywhere. No contracts.
              </motion.p>

              <motion.div variants={fadeUp} className="flex gap-4 justify-center md:justify-start">
                <button
                  onClick={() => navigate('/auth')}
                  className="bg-[#004ac6] text-white px-6 py-3 rounded-xl font-bold"
                >
                  Get Started
                </button>

                <button
                  onClick={() => navigate('/plans')}
                  className="border border-[#004ac6] text-[#004ac6] px-6 py-3 rounded-xl font-bold"
                >
                  View Plans
                </button>
              </motion.div>

            </motion.div>

            {/* HERO IMAGE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1580281657527-47f249e8f5c3"
                className="rounded-[2.5rem] shadow-2xl h-[420px] w-full object-cover"
              />

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl"
              >
                <p className="font-bold text-sm">Instant Coverage</p>
                <p className="text-xs text-gray-500">Activated in seconds</p>
              </motion.div>
            </motion.div>

          </div>
        </section>

        {/* IMAGE FEATURES */}
        <section className="px-6 py-24 bg-white">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6"
          >

            {[
              {
                img: "https://images.unsplash.com/photo-1603398938378-e54eab446dde",
                title: "Smart Wallet",
                desc: "Fund anytime, stay covered."
              },
              {
                img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
                title: "Hospital Access",
                desc: "Use trusted hospitals nationwide."
              },
              {
                img: "https://images.unsplash.com/photo-1584515933487-779824d29309",
                title: "Fast Claims",
                desc: "Submit and track easily."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="rounded-[2rem] overflow-hidden shadow-lg"
              >
                <img src={item.img} className="h-48 w-full object-cover" />
                <div className="p-6">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}

          </motion.div>
        </section>

        {/* TRUST SECTION */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="px-6 py-20 bg-[#f1f3ff]"
        >
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">

            {[
              {
                img: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5",
                title: "Secure Payments"
              },
              {
                img: "https://images.unsplash.com/photo-1571772996211-2f02c9727629",
                title: "Licensed Providers"
              },
              {
                img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
                title: "Mobile First"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-white rounded-[2rem] overflow-hidden shadow"
              >
                <img src={item.img} className="h-40 w-full object-cover" />
                <div className="p-6">
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-gray-500 text-sm">
                    Trusted healthcare infrastructure built for you.
                  </p>
                </div>
              </motion.div>
            ))}

          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="px-6 py-24"
        >
          <div className="max-w-5xl mx-auto bg-[#004ac6] text-white text-center p-16 rounded-[3rem]">
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              Ready to get started?
            </h2>

            <button
              onClick={() => navigate('/auth')}
              className="bg-white text-[#004ac6] px-8 py-4 rounded-xl font-bold"
            >
              Join PAYG
            </button>
          </div>
        </motion.section>

      </main>
    </div>
  )
}