import React, { useState } from 'react';
import { Clock, X, Calendar, Scissors } from 'lucide-react';

const PeluqueriaApp = () => {
  const [citas, setCitas] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedHora, setSelectedHora] = useState(null);
  
  const [servicios] = useState([
    { id: 1, nombre: "Corte de cabello + barba", precio: 15 },
    { id: 2, nombre: "Tinte", precio: 40 },
    { id: 3, nombre: "Peinado", precio: 25 },
    { id: 4, nombre: "Lavado", precio: 10 },
    { id: 5, nombre: "Mechas", precio: 50 }
  ]);

  const [operaciones, setOperaciones] = useState([]);

  const generarHorarios = () => {
    const horarios = [];
    const horasMañana = ['09', '10', '11', '12', '13'];
    const horasTarde = ['16', '17', '18', '19', '20'];
    const minutos = ['00', '20', '40'];

    [...horasMañana, ...horasTarde].forEach(hora => {
      minutos.forEach(minuto => {
        horarios.push(`${hora}:${minuto}`);
      });
    });

    return horarios;
  };

  const horarios = generarHorarios();

  const agruparHorariosPorHora = () => {
    const grupos = {};
    horarios.forEach(hora => {
      const horaBase = hora.substring(0, 2);
      if (!grupos[horaBase]) {
        grupos[horaBase] = [];
      }
      grupos[horaBase].push(hora);
    });
    return grupos;
  };

  const agregarCita = (hora, cliente, servicio) => {
    const nuevaCita = {
      id: Date.now(),
      fecha: selectedDate,
      hora,
      cliente,
      servicio,
      precio: servicios.find(s => s.nombre === servicio)?.precio || 0
    };
    setCitas([...citas, nuevaCita]);
    
    setOperaciones([...operaciones, {
      id: Date.now(),
      tipo: 'Ingreso',
      concepto: `Cita - ${servicio} - ${cliente}`,
      monto: nuevaCita.precio,
      fecha: new Date()
    }]);
  };

  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white" style={{ fontFamily: 'Poppins' }}>Nueva Cita</h3>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  const NuevaCita = ({ hora }) => {
    const [cliente, setCliente] = useState('');
    const [servicio, setServicio] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (cliente && servicio) {
        agregarCita(hora, cliente, servicio);
        setCliente('');
        setServicio('');
        setShowModal(false);
      }
    };

    return (
      <>
        <button
          onClick={() => {
            setSelectedHora(hora);
            setShowModal(true);
          }}
          className="min-w-[80px] px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center space-x-1 text-sm shadow-lg"
        >
          <span>+ Cita</span>
        </button>

        <Modal 
          isOpen={showModal && selectedHora === hora} 
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2" style={{ fontFamily: 'Poppins' }}>
                Nombre del Cliente
              </label>
              <input
                type="text"
                placeholder="Ingrese el nombre"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                style={{ fontFamily: 'Poppins' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2" style={{ fontFamily: 'Poppins' }}>
                Servicio
              </label>
              <select
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white"
                value={servicio}
                onChange={(e) => setServicio(e.target.value)}
                style={{ fontFamily: 'Poppins' }}
              >
                <option value="">Seleccionar servicio</option>
                {servicios.map(s => (
                  <option key={s.id} value={s.nombre}>{s.nombre}</option>
                ))}
              </select>
            </div>
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium shadow-lg"
              style={{ fontFamily: 'Poppins' }}
            >
              Guardar Cita
            </button>
          </form>
        </Modal>
      </>
    );
  };

  const CitasDelDia = () => {
    const citasHoy = citas.filter(cita => 
      new Date(cita.fecha).toDateString() === selectedDate.toDateString()
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {Object.entries(agruparHorariosPorHora()).map(([horaBase, slots]) => (
          <div key={horaBase} className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-700 hover:shadow-2xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4">
              <div className="text-xl font-semibold text-center" style={{ fontFamily: 'Poppins' }}>
                {horaBase}:00
              </div>
            </div>
            <div className="p-4 space-y-4">
              {slots.map(hora => (
                <div key={hora} className="bg-gray-800 rounded-xl p-4 transition-all hover:shadow-md border border-gray-700">
                  <div className="flex items-center justify-between mb-3 gap-4">
                    <div className="flex items-center min-w-[100px]">
                      <Clock className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="text-gray-200 whitespace-nowrap" style={{ fontFamily: 'Poppins' }}>{hora}</span>
                    </div>
                    <div className="flex-shrink-0">
                      <NuevaCita hora={hora} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    {citasHoy.filter(cita => cita.hora === hora).map(cita => (
                      <div 
                        key={cita.id} 
                        className="bg-gray-700 border border-gray-600 rounded-xl p-3 shadow-sm"
                      >
                        <div className="font-medium text-white" style={{ fontFamily: 'Poppins' }}>{cita.cliente}</div>
                        <div className="text-sm text-gray-300" style={{ fontFamily: 'Poppins' }}>{cita.servicio}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const ListaPrecios = () => (
    <div className="bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-700">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
          <Scissors className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-white" style={{ fontFamily: 'Poppins' }}>Lista de Precios</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
        {servicios.map(servicio => (
          <div 
            key={servicio.id} 
            className="bg-gray-800 rounded-xl p-4 flex justify-between items-center hover:shadow-md transition-all border border-gray-700"
          >
            <span className="text-gray-200" style={{ fontFamily: 'Poppins' }}>{servicio.nombre}</span>
            <span className="text-lg font-semibold bg-gray-900 px-4 py-1 rounded-full text-white shadow-sm border border-gray-700" style={{ fontFamily: 'Poppins' }}>
              {servicio.precio}€
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const OperacionesDiarias = () => {
    const operacionesHoy = operaciones.filter(op => 
      new Date(op.fecha).toDateString() === new Date().toDateString()
    );

    const total = operacionesHoy.reduce((sum, op) => sum + op.monto, 0);

    return (
      <div className="bg-gray-900 rounded-2xl shadow-xl p-8 mt-6 border border-gray-700">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-white" style={{ fontFamily: 'Poppins' }}>Operaciones</h2>
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-2 rounded-xl shadow-lg">
            <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Poppins' }}>{total}€</p>
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto pr-2 space-y-3">
          {operacionesHoy.map(op => (
            <div 
              key={op.id} 
              className="bg-gray-800 rounded-xl p-4 hover:shadow-md transition-all border border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-200" style={{ fontFamily: 'Poppins' }}>{op.concepto}</p>
                  <p className="text-sm text-gray-400" style={{ fontFamily: 'Poppins' }}>{op.tipo}</p>
                </div>
                <span className="font-semibold bg-gray-900 px-4 py-1 rounded-full text-white shadow-sm border border-gray-700" style={{ fontFamily: 'Poppins' }}>
                  {op.monto}€
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
              <Scissors className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'Poppins' }}>
              Gestión de Peluquería
            </h1>
          </div>
          <div className="w-full md:w-auto bg-gray-900 rounded-xl shadow-lg p-4 border border-gray-700">
            <div className="flex items-center space-x-4">
              <Calendar className="h-6 w-6 text-blue-400" />
              <input 
                type="date" 
                className="w-full md:w-auto p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                style={{ fontFamily: 'Poppins' }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-3/4">
            <CitasDelDia />
          </div>
          <div className="w-full lg:w-1/4">
            <ListaPrecios />
            <OperacionesDiarias />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeluqueriaApp;