import { motion } from "framer-motion";

export const AnimacionEntrada = ({ children }) => {
    return (
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
            {children}
        </motion.div>
    );
};
